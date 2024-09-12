package isep.engreq.hapibeebackend.models.apiary;

import isep.engreq.hapibeebackend.models.enums.ApiaryEventType;
import isep.engreq.hapibeebackend.models.enums.EventStateEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ApiaryEvent {

    private String id;
    private LocalDateTime requestAt;
    private EventStateEnum state;
    private ApiaryEventType type;

    public ApiaryEvent(ApiaryEventType type) {
        this.type = type;
    }

}
