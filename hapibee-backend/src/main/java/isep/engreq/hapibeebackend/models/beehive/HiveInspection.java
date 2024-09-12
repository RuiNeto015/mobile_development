package isep.engreq.hapibeebackend.models.beehive;

import lombok.Data;

import java.util.List;

@Data
public class HiveInspection {
    private String hiveId;
    private String hiveName;
    private String population;
    private String polenAndHoneyLevels;
    private String broodPattern;
    private String diseaseOrPests;
    private String temperament;
    private List<String> symptoms;
    private String additionalNotes;
}