package isep.engreq.portaldgadr.services;

import isep.engreq.portaldgadr.client.HapibeeFeignClient;
import isep.engreq.portaldgadr.dtos.ProcessAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.ResponseAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.ResponseCreationNewApiaryDto;
import isep.engreq.portaldgadr.documents.CreateApiaryRequestDocument;
import isep.engreq.portaldgadr.documents.EmitAnnualDeclarationRequestDocument;
import isep.engreq.portaldgadr.models.enums.RequestAnnualDeclarationEmissionStatus;
import isep.engreq.portaldgadr.dtos.ResponseTranshumanceDto;
import isep.engreq.portaldgadr.models.enums.RequestCreationNewApiaryStatus;
import isep.engreq.portaldgadr.repositories.AnnualDeclarationRepository;
import isep.engreq.portaldgadr.repositories.RequestsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class MockSendService {

    @Autowired
    private RequestsRepository repository;

    @Autowired
    private AnnualDeclarationRepository annualDeclarationRepository;

    @Autowired
    private HapibeeFeignClient hapibeeClient;

    public void logicToActivateWebhookOfNewApiaryEvent(String id, boolean inControlledZone, boolean wasAccepted) {
        Optional<CreateApiaryRequestDocument> optRequest = this.repository.findByIdAndInControlledZone(id,
                inControlledZone);
        if (optRequest.isPresent()) {
            CreateApiaryRequestDocument request = optRequest.get();
            request.setProcessedBy("Manuel Filipe #932132");
            request.setProcessedAt(LocalDateTime.now());
            if (wasAccepted) {
                request.setObservations("O apiário reune as condições necessárias para a sua implantação segundo o Artigo 7.º do Decreto-Lei n.º 374/2007 — 7 de Novembro de 2007!");
                request.setStatus(RequestCreationNewApiaryStatus.APPROVED);
            } else {
                request.setObservations(this.getRejectPhrase());
                request.setStatus(RequestCreationNewApiaryStatus.REJECTED);
            }
            request.setInControlledZone(inControlledZone);

            ResponseCreationNewApiaryDto payloadToSend = new ResponseCreationNewApiaryDto();
            payloadToSend.setProcessedBy(request.getProcessedBy());
            payloadToSend.setRequestId(request.getId());
            payloadToSend.setApiaryId(request.getApiaryDto().getId());
            payloadToSend.setObservations(request.getObservations());
            payloadToSend.setProcessedAt(request.getProcessedAt());
            if (inControlledZone && wasAccepted) { // CONTROLLED ZONE AND APPROVED
                this.hapibeeClient.webhookToAcceptRequestNewApiaryControlledZone(payloadToSend);
            } else if (inControlledZone && !wasAccepted) { // CONTROLLED ZONE AND REJECTED
                this.hapibeeClient.webhookToRejectRequestNewApiaryControlledZone(payloadToSend);
            } else if (!inControlledZone && wasAccepted) { // DGADR AND APPROVED
                this.hapibeeClient.webhookToAcceptRequestNewApiaryDgadr(payloadToSend);
            } else if (!inControlledZone && !wasAccepted) {// DGADR AND REJECTED
                this.hapibeeClient.webhookToRejectRequestNewApiaryDgadr(payloadToSend);
            }
            this.repository.save(request);
        } else {
            throw new IllegalArgumentException("No document found in logicToActivateWebhookOfNewApiaryEvent");
        }
    }

    public void logicToActivateWebhookOfAnnualDeclarationEvent(String id, boolean wasAccepted, ProcessAnnualDeclaration comingRequest) {
        Optional<EmitAnnualDeclarationRequestDocument> optRequest = this.annualDeclarationRepository.findById(id);
        if (optRequest.isPresent()) {
            EmitAnnualDeclarationRequestDocument request = optRequest.get();
            request.setProcessedBy(comingRequest.getProcessedBy());
            request.setProcessedAt(LocalDateTime.now());
            if (wasAccepted) {
                request.setObservations(comingRequest.getObservations());
                request.setStatus(RequestAnnualDeclarationEmissionStatus.APPROVED);
            } else {
                request.setObservations(
                        "Houve um problema com a sua declaração anual...");
                request.setStatus(RequestAnnualDeclarationEmissionStatus.REJECTED);
            }

            ResponseAnnualDeclaration payloadToSend = new ResponseAnnualDeclaration();
            payloadToSend.setProcessedBy(request.getProcessedBy());
            payloadToSend.setRequestId(request.getId());
            payloadToSend.setAnnualDeclarationId(request.getAnnualDeclaration().getId());
            payloadToSend.setObservations(request.getObservations());
            payloadToSend.setProcessedAt(request.getProcessedAt());
            if (wasAccepted) { // APPROVED
                this.hapibeeClient.webhookToAcceptRequestAnnualDeclaration(payloadToSend);
            } else {
                this.hapibeeClient.webhookToRejectRequestAnnualDeclaration(payloadToSend);
            }
            this.annualDeclarationRepository.save(request);
        } else {
            throw new IllegalArgumentException("No document found in logicToActivateWebhookOfNewApiaryEvent");
        }
    }

    private String getRejectPhrase() {
        List<String> rejectionReasons = Arrays.asList(
                "Verificamos que se encontra próximo de um outro apiário!",
                "O local escolhido para o apiário não atende aos requisitos de segurança necessários!",
                "Já existe um número máximo de apiários permitidos na região!",
                "Atualmente, a zona para que se deseja movimentar encontra-se em fecho sanitário!",
                "O número de colónias excede o limite aceite por apiário, segundo o Artigo 7.º do Decreto-Lei n.º 374/2007 — 7 de Novembro de 2007!"
        );

        Random random = new Random();
        int randomIndex = random.nextInt(rejectionReasons.size());

        return rejectionReasons.get(randomIndex) +
                "\nNOTA: Dado que o pedido foi rejeitado, a reavaliação do mesmo é feita pela submissão de um novo pedido!";
    }

    public void sendTranshumanceWebhook(ResponseTranshumanceDto responseTranshumanceDto) {
        this.hapibeeClient.webhookToHandleTranshumances(responseTranshumanceDto);
    }
}
