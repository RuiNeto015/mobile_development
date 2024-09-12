package isep.engreq.hapibeebackend.controllers;

import isep.engreq.hapibeebackend.clients.dtos.ResponseAnnualDeclaration;
import isep.engreq.hapibeebackend.clients.dtos.ResponseCreationNewApiaryDto;
import isep.engreq.hapibeebackend.dtos.AnnualDeclarationDto;
import isep.engreq.hapibeebackend.clients.dtos.ResponseTranshumanceDto;
import isep.engreq.hapibeebackend.dtos.ApiaryDto;
import isep.engreq.hapibeebackend.services.AnnualDeclarationWebhooksService;
import isep.engreq.hapibeebackend.services.ApiaryWebhooksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
public class PortalWebhooksController {

    private final ApiaryWebhooksService apiaryWebhooksService;

    private final AnnualDeclarationWebhooksService annualDeclarationWebhooksService;

    @PostMapping("/controlledzone/apiary/creation/approve")
    public ResponseEntity<?> ControlledZoneApproveNewApiary(@RequestBody ResponseCreationNewApiaryDto request) {
        ApiaryDto apiaryDto = this.apiaryWebhooksService.manageLogicOfCreateNewApiary(request, true, true);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(apiaryDto);
    }

    @PostMapping("/controlledzone/apiary/creation/reject")
    public ResponseEntity<?> ControlledZoneRejectNewApiary(@RequestBody ResponseCreationNewApiaryDto request) {
        ApiaryDto apiaryDto = this.apiaryWebhooksService.manageLogicOfCreateNewApiary(request, true, false);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(apiaryDto);
    }

    @PostMapping("/dgadr/apiary/creation/approve")
    public ResponseEntity<?> DgadrApproveApiary(@RequestBody ResponseCreationNewApiaryDto request) {
        ApiaryDto apiaryDto = this.apiaryWebhooksService.manageLogicOfCreateNewApiary(request, false, true);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(apiaryDto);
    }

    @PostMapping("/dgadr/apiary/creation/reject")
    public ResponseEntity<?> DgadrRejectApiary(@RequestBody ResponseCreationNewApiaryDto request) {
        ApiaryDto apiaryDto = this.apiaryWebhooksService.manageLogicOfCreateNewApiary(request, false, false);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(apiaryDto);
    }

    @PostMapping("/dgadr/annualDeclaration/accept")
    public ResponseEntity<?> ApproveAnnualDeclaration(@RequestBody ResponseAnnualDeclaration request) {
        AnnualDeclarationDto annualDeclarationDto = this.annualDeclarationWebhooksService
                .manageLogicOfCreateNewAnnualDeclarationDto(request, true);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(annualDeclarationDto);
    }

    @PostMapping("/dgadr/annualDeclaration/reject")
    public ResponseEntity<?> RejectAnnualDeclaration(@RequestBody ResponseAnnualDeclaration request) {
        AnnualDeclarationDto annualDeclarationDto = this.annualDeclarationWebhooksService
                .manageLogicOfCreateNewAnnualDeclarationDto(request, false);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(annualDeclarationDto);
    }

    @PostMapping("/controlledzone/apiary/transhumance")
    public ResponseEntity<?> ControlledZoneRejectTranshumance(@RequestBody ResponseTranshumanceDto request) {
        this.apiaryWebhooksService.transhumanceWebhook(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

}
