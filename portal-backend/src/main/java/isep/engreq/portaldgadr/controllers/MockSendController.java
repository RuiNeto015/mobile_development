package isep.engreq.portaldgadr.controllers;

import isep.engreq.portaldgadr.dtos.ProcessAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.RequestAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.ResponseAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.ResponseTranshumanceDto;
import isep.engreq.portaldgadr.services.MockSendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class MockSendController {

    private final MockSendService mockSendService;

    @PostMapping("/webhook/requestNewApiary/controlledzone/approve/{id}")
    public ResponseEntity<?> activateWebhookToApproveNewApiaryControlledZone(@PathVariable String id) {
        this.mockSendService.logicToActivateWebhookOfNewApiaryEvent(id, true, true);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("/webhook/requestNewApiary/controlledzone/reject/{id}")
    public ResponseEntity<?> activateWebhookToRejectNewApiaryDgadr(@PathVariable String id) {
        this.mockSendService.logicToActivateWebhookOfNewApiaryEvent(id, true, false);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("/webhook/requestNewApiary/dgadr/approve/{id}")
    public ResponseEntity<?> activateWebhookToApproveNewApiaryDgadr(@PathVariable String id) {
        this.mockSendService.logicToActivateWebhookOfNewApiaryEvent(id, false, true);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("/webhook/requestNewApiary/dgadr/reject/{id}")
    public ResponseEntity<?> activateWebhookToRejectNewApiaryControlledZone(@PathVariable String id) {
        this.mockSendService.logicToActivateWebhookOfNewApiaryEvent(id, false, false);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("/webhook/dgav/transhumance")
    public ResponseEntity<?> activateWebhookToHandleTranshumance(@RequestBody ResponseTranshumanceDto request) {
        this.mockSendService.sendTranshumanceWebhook(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("/webhook/requestAnnualDeclaration/dgadr/accept/{id}")
    public ResponseEntity<?> activateWebhookToAcceptAnnualDeclaration(@PathVariable String id, @RequestBody ProcessAnnualDeclaration request) {
        this.mockSendService.logicToActivateWebhookOfAnnualDeclarationEvent(id, true, request);
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }

    @PostMapping("/webhook/requestAnnualDeclaration/dgadr/reject/{id}")
    public ResponseEntity<?> activateWebhookToRejectAnnualDeclaration(@PathVariable String id,  @RequestBody ProcessAnnualDeclaration request) {
        this.mockSendService.logicToActivateWebhookOfAnnualDeclarationEvent(id, false, request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("ok");
    }
}
