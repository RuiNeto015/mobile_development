package isep.engreq.hapibeebackend.controllers;

import isep.engreq.hapibeebackend.documents.ApiaryDocument;
import isep.engreq.hapibeebackend.documents.NotificationDocument;
import isep.engreq.hapibeebackend.dtos.*;
import isep.engreq.hapibeebackend.repositories.NotificationRepository;
import isep.engreq.hapibeebackend.services.ApiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apiary")
@RequiredArgsConstructor
public class ApiaryController {

    private final ApiaryService apiaryService;

    @Autowired
    private final NotificationRepository notificationRepository;

    @GetMapping("/all/{tenantId}")
    public ResponseEntity<?> getApiaries(@PathVariable String tenantId) {
        List<ApiaryDto> products = this.apiaryService.getAllApiaries(tenantId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(products);
    }

    @PostMapping
    public ResponseEntity<?> createApiary(@RequestBody CreateApiaryDto createApiaryDto) {
        ApiaryDto products = this.apiaryService.createApiary(createApiaryDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(products);
    }

    @PostMapping("/transhumance")
    public ResponseEntity<?> createTranshumance(@RequestBody CreateTranshumanceDto createTranshumance) {
        TranshumanceDto transhumanceDto = this.apiaryService.createTranshumance(createTranshumance);
        return ResponseEntity.status(HttpStatus.OK).body(transhumanceDto);
    }

    @PostMapping("/disease")
    public ResponseEntity<?> registerDisease(@RequestBody RegisterDiseaseDTO registerDiseaseDTO) {
        this.apiaryService.registerDisease(registerDiseaseDTO);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @GetMapping("/notifications/{tenantId}")
    public ResponseEntity<?> getNotifications(@PathVariable String tenantId) {
        List<NotificationDocument> notifications =  this.notificationRepository.findAllByTenantId(tenantId);
        return ResponseEntity.status(HttpStatus.OK).body(notifications);
    }
}
