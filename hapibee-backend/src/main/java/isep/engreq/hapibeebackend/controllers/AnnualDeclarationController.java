package isep.engreq.hapibeebackend.controllers;

import isep.engreq.hapibeebackend.dtos.AnnualDeclarationDto;
import isep.engreq.hapibeebackend.dtos.ApiaryDto;
import isep.engreq.hapibeebackend.services.AnnualDeclarationService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/annualDeclaration")
@RequiredArgsConstructor
public class AnnualDeclarationController {

    private final AnnualDeclarationService annualDeclarationService;

    @PostMapping
    public ResponseEntity<?> createAnnualDeclaration(@RequestBody AnnualDeclarationDto annualDeclarationDto) {
        AnnualDeclarationDto annualDeclaration = this.annualDeclarationService.createAnnualDeclaration(annualDeclarationDto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(annualDeclaration);
    }

    @GetMapping("/all/{tenantId}")
    public ResponseEntity<?> getAnnualDeclarationsByTenant(@PathVariable(value = "tenantId") String tenantId) {
        List<AnnualDeclarationDto> annualDeclarationsByTenant = this.annualDeclarationService.getAnnualDeclarationsByTenant(tenantId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(annualDeclarationsByTenant);
    }
}