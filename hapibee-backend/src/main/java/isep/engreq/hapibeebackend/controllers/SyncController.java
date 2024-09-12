package isep.engreq.hapibeebackend.controllers;

import isep.engreq.hapibeebackend.dtos.ApiaryDto;
import isep.engreq.hapibeebackend.dtos.CreateApiaryDto;
import isep.engreq.hapibeebackend.dtos.SyncRequestDto;
import isep.engreq.hapibeebackend.dtos.SyncResponseDto;
import isep.engreq.hapibeebackend.services.ApiaryService;
import isep.engreq.hapibeebackend.services.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sync")
@RequiredArgsConstructor
public class SyncController {

    private final SyncService syncService;

    @GetMapping("/check")
    public ResponseEntity<?> getApiaries() {
        List<ApiaryDto> products = null;

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(products);
    }

    @PostMapping
    public ResponseEntity<?> createApiary(@RequestBody SyncRequestDto createApiaryDto) {
        SyncResponseDto result = this.syncService.syncInformation(createApiaryDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(result);
    }
}
