package isep.engreq.hapibeebackend.documents;

import isep.engreq.hapibeebackend.models.beehive.HiveInspection;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "inspections")
public class InspectionDocument {
    private String id;
    private String apiaryId;
    private String apiaryName;
    private String date;
    private String startTime;
    private String endTime;
    private List<HiveInspection> hives;
    private String type;

}