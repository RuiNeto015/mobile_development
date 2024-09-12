package isep.engreq.portaldgadr.dtos;

import lombok.Data;

@Data
public class RequestAnnualDeclaration {

    private String requestId;
    private AnnualDeclarationDto annualDeclarationDto;
}

