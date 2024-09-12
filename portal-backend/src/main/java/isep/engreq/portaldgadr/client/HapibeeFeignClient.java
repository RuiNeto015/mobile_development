package isep.engreq.portaldgadr.client;

import isep.engreq.portaldgadr.dtos.ResponseAnnualDeclaration;
import isep.engreq.portaldgadr.dtos.ResponseCreationNewApiaryDto;
import isep.engreq.portaldgadr.dtos.ResponseTranshumanceDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(value = "portal", url = "${hapibee-backend.url}")
public interface HapibeeFeignClient {

    @RequestMapping(method = RequestMethod.POST, value = "/webhooks/controlledzone/apiary/creation/approve", produces = "application/json")
    ResponseEntity<String> webhookToAcceptRequestNewApiaryControlledZone(
            @RequestBody ResponseCreationNewApiaryDto request);

    @RequestMapping(method = RequestMethod.POST, value = "/webhooks/controlledzone/apiary/creation/reject", produces = "application/json")
    ResponseEntity<String> webhookToRejectRequestNewApiaryControlledZone(
            @RequestBody ResponseCreationNewApiaryDto request);

    @RequestMapping(method = RequestMethod.POST, value = "/webhooks/dgadr/apiary/creation/approve", produces = "application/json")
    ResponseEntity<String> webhookToAcceptRequestNewApiaryDgadr(@RequestBody ResponseCreationNewApiaryDto request);

    @RequestMapping(method = RequestMethod.POST, value = "/webhooks/dgadr/apiary/creation/reject", produces = "application/json")
    ResponseEntity<String> webhookToRejectRequestNewApiaryDgadr(@RequestBody ResponseCreationNewApiaryDto request);

    @RequestMapping(method = RequestMethod.POST, value = "/webhooks/dgadr/annualDeclaration/accept", produces = "application/json")
    ResponseEntity<String> webhookToAcceptRequestAnnualDeclaration(@RequestBody ResponseAnnualDeclaration request);

    @RequestMapping(method = RequestMethod.POST, value = "/webhooks/dgadr/annualDeclaration/reject", produces = "application/json")
    ResponseEntity<String> webhookToRejectRequestAnnualDeclaration(@RequestBody ResponseAnnualDeclaration request);

    @RequestMapping(method = RequestMethod.POST, value = "/webhooks/controlledzone/apiary/transhumance", produces = "application/json")
    ResponseEntity<String> webhookToHandleTranshumances(@RequestBody ResponseTranshumanceDto request);
}
