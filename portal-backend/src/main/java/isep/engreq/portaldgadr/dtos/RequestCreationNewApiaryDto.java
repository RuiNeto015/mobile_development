package isep.engreq.portaldgadr.dtos;

import isep.engreq.portaldgadr.models.ApiaryInfo;
import lombok.Data;

@Data
public class RequestCreationNewApiaryDto {

    private String requestId;
    private String userId;
    private ApiaryInfo apiaryDto;
    private boolean inControlledZone;

}
