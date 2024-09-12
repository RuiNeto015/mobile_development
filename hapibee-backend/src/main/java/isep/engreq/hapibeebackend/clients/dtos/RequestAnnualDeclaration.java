package isep.engreq.hapibeebackend.clients.dtos;

import isep.engreq.hapibeebackend.dtos.AnnualDeclarationDto;
import lombok.Data;

@Data
public class RequestAnnualDeclaration {

    private String requestId;
    private AnnualDeclarationDto annualDeclarationDto;
}
