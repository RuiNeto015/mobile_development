package isep.engreq.hapibeebackend.models.apiary;

import isep.engreq.hapibeebackend.models.enums.ApiaryEventType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
public class ApiaryCreationEvent extends ApiaryEvent {

    private boolean toControlledZone;
    private String processedBy;
    private LocalDateTime processedAt;
    private String observations;

    public ApiaryCreationEvent() {
        super(ApiaryEventType.REQUEST_TO_CREATE);
    }
}
