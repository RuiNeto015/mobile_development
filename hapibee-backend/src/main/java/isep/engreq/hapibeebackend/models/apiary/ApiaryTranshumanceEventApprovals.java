package isep.engreq.hapibeebackend.models.apiary;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class ApiaryTranshumanceEventApprovals {
    private String processedBy;
    private String observations;
    private Date processedAt;
    private boolean approved;
}
