package isep.engreq.hapibeebackend.models.beehive;

import lombok.Data;

import java.util.List;

@Data
public class Inspection {
    private String id;
    private String apiaryId;
    private String date;
    private String startTime;
    private String endTime;
    private List<HiveInspection> hives;
    private String type;

}