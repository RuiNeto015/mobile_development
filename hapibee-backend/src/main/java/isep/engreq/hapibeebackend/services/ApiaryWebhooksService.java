package isep.engreq.hapibeebackend.services;

import isep.engreq.hapibeebackend.clients.dtos.FirebaseNotification;
import isep.engreq.hapibeebackend.clients.dtos.FirebaseNotificationBody;
import isep.engreq.hapibeebackend.clients.dtos.ResponseCreationNewApiaryDto;
import isep.engreq.hapibeebackend.clients.dtos.ResponseTranshumanceDto;
import isep.engreq.hapibeebackend.documents.ApiaryDocument;
import isep.engreq.hapibeebackend.documents.NotificationDocument;
import isep.engreq.hapibeebackend.documents.UserDocument;
import isep.engreq.hapibeebackend.dtos.ApiaryDto;
import isep.engreq.hapibeebackend.models.apiary.ApiaryCreationEvent;
import isep.engreq.hapibeebackend.models.apiary.ApiaryEvent;
import isep.engreq.hapibeebackend.models.apiary.ApiaryTranshumanceEvent;
import isep.engreq.hapibeebackend.models.apiary.ApiaryTranshumanceEventApprovals;
import isep.engreq.hapibeebackend.models.enums.ApiaryStateEnum;
import isep.engreq.hapibeebackend.models.enums.EventStateEnum;
import isep.engreq.hapibeebackend.repositories.ApiaryRepository;
import isep.engreq.hapibeebackend.repositories.NotificationRepository;
import isep.engreq.hapibeebackend.repositories.UserRepository;
import isep.engreq.hapibeebackend.utils.MD5Utils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ApiaryWebhooksService {

    @Autowired
    private ApiaryRepository apiaryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private final ModelMapper mapper = new ModelMapper();

    @Autowired
    private WebClient firebaseWebClient;

    @Value("${firebase.notification.key}")
    private String key;

    @Value("${firebase.notification.to}")
    private String to;

    @Autowired
    private MD5Utils md5Utils;

    public ApiaryDto manageLogicOfCreateNewApiary(ResponseCreationNewApiaryDto response, boolean inControlledZone, boolean wasAccepted) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        Optional<ApiaryDocument> apiaryDocumentOpt = this.apiaryRepository.findByIdAndApiaryHistoryId(response.getApiaryId(), response.getRequestId());
        if (apiaryDocumentOpt.isEmpty()) {
            throw new IllegalArgumentException("Process id not found");
        }
        ApiaryDocument apiaryDocument = apiaryDocumentOpt.get();
        //updates the respective request in the apiary
        apiaryDocument.getApiaryHistory().forEach(event -> {
            if (event.getId().equals(response.getRequestId())) {
                //updates the create new apiary request
                ApiaryCreationEvent creationEvent = (ApiaryCreationEvent) event;
                if (wasAccepted) {
                    creationEvent.setState(EventStateEnum.APPROVED);
                } else {
                    creationEvent.setState(EventStateEnum.REJECTED);
                }
                creationEvent.setObservations(response.getObservations());
                creationEvent.setProcessedAt(response.getProcessedAt());
                creationEvent.setProcessedBy(response.getProcessedBy());

                //updates the apiary info
                FirebaseNotification notification;
                Optional<UserDocument> userDocument = this.userRepository.findByRoleAndTenantId("ADMIN", apiaryDocument.getTenantId());
                if (wasAccepted) {
                    apiaryDocument.setStatus(ApiaryStateEnum.ACTIVE);
                    // http request body
                    notification = new FirebaseNotification(to, new FirebaseNotificationBody(
                            "Pedido de novo apiário aceite",
                            "O seu pedido de novo apiário (" + event.getId() + ") foi aceite.")
                    );
                } else {
                    notification = new FirebaseNotification(to, new FirebaseNotificationBody(
                            "Pedido de novo apiário rejeitado",
                            "O seu pedido de novo apiário (" + event.getId() + ") foi rejeitado.")
                    );
                    if (inControlledZone) {
                        apiaryDocument.setStatus(ApiaryStateEnum.REJECTED_BY_CZ);
                    } else {
                        apiaryDocument.setStatus(ApiaryStateEnum.REJECTED_BY_DGADR);
                    }
                }
                // make http request to firebase (triggers)
                firebaseWebClient.post().header(HttpHeaders.AUTHORIZATION, "key=" + key)
                        .bodyValue(notification).retrieve().toEntity(String.class).block();

                // save notification in bd
                this.notificationRepository.save(new NotificationDocument(notification.getNotification().getTitle(),
                        notification.getNotification().getBody(), LocalDate.now(), LocalTime.now().format(formatter),
                        apiaryDocument.getTenantId()));
                apiaryDocument.setMd5(md5Utils.getMd5Hash(apiaryDocument));
                apiaryDocument.setChangedAt(LocalDateTime.now());
            }
        });
        this.apiaryRepository.save(apiaryDocument);
        return this.mapper.map(apiaryDocument, ApiaryDto.class);
    }

    public void transhumanceWebhook(ResponseTranshumanceDto request) {
        Optional<ApiaryDocument> apiaryData = this.apiaryRepository.findById(request.getApiaryId());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        ApiaryDocument apiaryDocument = apiaryData.get();
        List<ApiaryEvent> history = apiaryDocument.getApiaryHistory();

        for (int i = 0; i < history.size(); i++) {
            if (history.get(i).getId() != null && history.get(i).getId().equals(request.getRequestId())) {
                ApiaryTranshumanceEvent event = (ApiaryTranshumanceEvent) history.get(i);

                if (event.getApprovals() == null) {
                    event.setApprovals(new ArrayList<>());
                }

                if (event.getApprovals().size() == 2 || event.getState() == EventStateEnum.APPROVED ||
                        event.getState() == EventStateEnum.REJECTED) {
                    throw new IllegalArgumentException("Not accepting more requests");
                }

                event.getApprovals().add(new ApiaryTranshumanceEventApprovals(request.getProcessedBy(),
                        request.getObservations(), new Date(), request.getApproved()));

                if (event.getApprovals().size() == 2 && event.getApprovals().get(0).isApproved() && event.getApprovals().get(1).isApproved()) {
                    history.get(i).setState(EventStateEnum.APPROVED);

                    // http request body
                    FirebaseNotification notification = new FirebaseNotification(to, new FirebaseNotificationBody(
                            "Pedido de transumância aceite",
                            "O seu pedido de transumância (" + event.getId() + ") foi aceite."));

                    // make http request to firebase (triggers)
                    firebaseWebClient.post().header(HttpHeaders.AUTHORIZATION, "key=" + key)
                            .bodyValue(notification).retrieve().toEntity(String.class).block();

                    // save notification in bd
                    this.notificationRepository.save(new NotificationDocument(notification.getNotification().getTitle(),
                            notification.getNotification().getBody(), LocalDate.now(), LocalTime.now().format(formatter),
                            apiaryDocument.getTenantId()));
                } else if (event.getApprovals().size() == 2) {
                    Optional<UserDocument> userDocument = this.userRepository.findByRoleAndTenantId("ADMIN", apiaryDocument.getTenantId());
                    history.get(i).setState(EventStateEnum.REJECTED);

                    // http request body
                    FirebaseNotification notification = new FirebaseNotification(to, new FirebaseNotificationBody(
                            "Pedido de transumância rejeitado",
                            "O seu pedido de transumância (" + event.getId() + ") foi rejeitado."));

                    // make http request to firebase (triggers)
                    firebaseWebClient.post().header(HttpHeaders.AUTHORIZATION, "key=" + key)
                            .bodyValue(notification).retrieve().toEntity(String.class).block();

                    // save notification in bd
                    this.notificationRepository.save(new NotificationDocument(notification.getNotification().getTitle(),
                            notification.getNotification().getBody(), LocalDate.now(), LocalTime.now().format(formatter),
                            apiaryDocument.getTenantId()));
                }
                history.set(i, event);
                this.apiaryRepository.save(apiaryDocument);
            }
        }
    }
}
