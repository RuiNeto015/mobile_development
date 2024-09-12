package isep.engreq.hapibeebackend.models.apiary;

import isep.engreq.hapibeebackend.models.enums.ApiaryEventType;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ApiaryDiseaseEvent extends ApiaryEvent {
    private String disease;

    public ApiaryDiseaseEvent(String disease) {
        super(ApiaryEventType.DISEASE);
        this.disease = disease;
    }
}
