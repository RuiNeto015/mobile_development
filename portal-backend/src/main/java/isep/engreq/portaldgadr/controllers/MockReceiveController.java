package isep.engreq.portaldgadr.controllers;

import isep.engreq.portaldgadr.dtos.RequestAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.RequestCreationNewApiaryDto;
import isep.engreq.portaldgadr.services.MockReceiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class MockReceiveController {

    private final MockReceiveService portalService;

    @PostMapping("/controlledzone/requestNewApiary")
    public ResponseEntity<?> requestNewApiaryControlledZone(@RequestBody RequestCreationNewApiaryDto request) {
        request.setInControlledZone(true);
        this.portalService.registerRequest(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("/dgadr/requestNewApiary")
    public ResponseEntity<?> requestNewApiaryDgadr(@RequestBody RequestCreationNewApiaryDto request) {
        request.setInControlledZone(false);
        this.portalService.registerRequest(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("annualDeclaration/requestAnnualDeclarationEmission")
    public ResponseEntity<?> requestAnnualDeclarationEmission(@RequestBody RequestAnnualDeclaration request) {
        this.portalService.registerAnnualDeclarationEmissionRequest(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }
}
