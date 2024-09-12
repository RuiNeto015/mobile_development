package isep.engreq.portaldgadr.documents;

import isep.engreq.portaldgadr.models.enums.RequestCreationNewApiaryStatus;
import isep.engreq.portaldgadr.models.ApiaryInfo;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Data
@Document(collection = "createApiaryRequests")
public class CreateApiaryRequestDocument {

    @MongoId
    private String id;
    private String userId;
    private ApiaryInfo apiaryDto;
    private LocalDateTime registeredAt;
    private boolean inControlledZone;
    private String processedBy;
    private LocalDateTime processedAt;
    private String observations;
    private RequestCreationNewApiaryStatus status;

}
