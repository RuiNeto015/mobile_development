package isep.engreq.hapibeebackend.clients;

import isep.engreq.hapibeebackend.clients.dtos.RequestAnnualDeclaration;
import isep.engreq.hapibeebackend.clients.dtos.RequestCreationNewApiaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class PortalWebClient {

    private final WebClient webClient;

    public ResponseEntity<String> requestCreateApiaryToControlledZone(RequestCreationNewApiaryDto request) {
        return webClient
                .post()
                .uri("/controlledzone/requestNewApiary")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .toEntity(String.class)
                .block();
    }

    public ResponseEntity<String> requestCreateApiaryToDgadr(RequestCreationNewApiaryDto request) {
        return webClient
                .post()
                .uri("dgadr/requestNewApiary")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .toEntity(String.class)
                .block();
    }

    public ResponseEntity<String> requestAnnualDeclarationEmission(RequestAnnualDeclaration request) {
        return webClient
                .post()
                .uri("annualDeclaration/requestAnnualDeclarationEmission")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .toEntity(String.class)
                .block();
    }
}
