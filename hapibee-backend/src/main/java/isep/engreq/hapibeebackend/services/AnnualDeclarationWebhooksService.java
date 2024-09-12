package isep.engreq.hapibeebackend.services;

import isep.engreq.hapibeebackend.clients.dtos.FirebaseNotification;
import isep.engreq.hapibeebackend.clients.dtos.FirebaseNotificationBody;
import isep.engreq.hapibeebackend.clients.dtos.ResponseAnnualDeclaration;
import isep.engreq.hapibeebackend.documents.AnnualDeclarationDocument;
import isep.engreq.hapibeebackend.documents.NotificationDocument;
import isep.engreq.hapibeebackend.dtos.AnnualDeclarationDto;
import isep.engreq.hapibeebackend.models.annualDeclaration.AnnualDeclarationEmissionEvent;
import isep.engreq.hapibeebackend.models.enums.AnnualDeclarationState;
import isep.engreq.hapibeebackend.models.enums.EventStateEnum;
import isep.engreq.hapibeebackend.repositories.AnnualDeclarationRepository;
import isep.engreq.hapibeebackend.repositories.NotificationRepository;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class AnnualDeclarationWebhooksService {

    @Autowired
    private AnnualDeclarationRepository annualDeclarationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private final ModelMapper mapper = new ModelMapper();

    @Autowired
    private WebClient firebaseWebClient;

    @Value("${firebase.notification.key}")
    private String key;

    @Value("${firebase.notification.to}")
    private String to;

    public AnnualDeclarationDto manageLogicOfCreateNewAnnualDeclarationDto(ResponseAnnualDeclaration response,
            boolean wasAccepted) {
        Optional<AnnualDeclarationDocument> annualDeclarationDocumentOpt = this.annualDeclarationRepository
                .findByIdAndAnnualDeclarationHistoryId(response.getAnnualDeclarationId(), response.getRequestId());
        if (annualDeclarationDocumentOpt.isEmpty()) {
            throw new IllegalArgumentException("Process id not found");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        AnnualDeclarationDocument annualDeclarationDocument = annualDeclarationDocumentOpt.get();

        AnnualDeclarationEmissionEvent event = new AnnualDeclarationEmissionEvent();

        if (wasAccepted) {
            event.setState(EventStateEnum.APPROVED);
            annualDeclarationDocument.setState(AnnualDeclarationState.ACCEPTED);

            // http request body
            FirebaseNotification notification = new FirebaseNotification(to, new FirebaseNotificationBody(
                    "Declaração anual aceite", "A sua declaração anual foi aceite."));

            // make http request to firebase (triggers)
            firebaseWebClient.post().header(HttpHeaders.AUTHORIZATION, "key=" + key)
                    .bodyValue(notification).retrieve().toEntity(String.class).block();

            // save notification in bd
            this.notificationRepository.save(new NotificationDocument(notification.getNotification().getTitle(),
                    notification.getNotification().getBody(), LocalDate.now(), LocalTime.now().format(formatter),
                    annualDeclarationDocument.getTenantId()));

        } else {
            event.setState(EventStateEnum.REJECTED);
            annualDeclarationDocument.setState(AnnualDeclarationState.REJECTED);

            // http request body
            FirebaseNotification notification = new FirebaseNotification(to, new FirebaseNotificationBody(
                    "Declaração anual recusada", "A sua declaração anual foi recusada."));

            // make http request to firebase (triggers)
            firebaseWebClient.post().header(HttpHeaders.AUTHORIZATION, "key=" + key)
                    .bodyValue(notification).retrieve().toEntity(String.class).block();

            // save notification in bd
            this.notificationRepository.save(new NotificationDocument(notification.getNotification().getTitle(),
                    notification.getNotification().getBody(), LocalDate.now(), LocalTime.now().format(formatter),
                    annualDeclarationDocument.getTenantId()));
        }
        event.setObservations(response.getObservations());
        event.setProcessedAt(response.getProcessedAt());
        event.setProcessedBy(response.getProcessedBy());

        annualDeclarationDocument.setChangedAt(LocalDateTime.now());

        annualDeclarationDocument.addEvent(event);

        this.annualDeclarationRepository.save(annualDeclarationDocument);
        return this.mapper.map(annualDeclarationDocument, AnnualDeclarationDto.class);
    }

}
