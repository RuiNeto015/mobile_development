package isep.engreq.hapibeebackend.models.beehive;

import isep.engreq.hapibeebackend.models.enums.BeehiveStructureType;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class Beehive {

    private String id;
    private String name;
    private String type;
    private BeehiveStructureType structureType; //colmeia normal ou cortiço/núcleo
    private String color;
    private String source;
    private LocalDate dateOfImplantation;
    private Integer frames;
    private String queenRace;
    private LocalDate queenAcceptAt;
    private Integer inspectionsCount;
    private Integer hiveBodiesOfCreation;
    private Integer hiveBodiesOfHoney;
    private List<BeehiveHistory> beehiveHistory;
}
