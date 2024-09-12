package isep.engreq.hapibeebackend.dtos;

import isep.engreq.hapibeebackend.models.enums.BeehiveStructureType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateBeehiveDto {

    private String name;
    private String type;
    private BeehiveStructureType structureType; //colmeia normal ou cortiço/núcleo
    private String color;
    private String source;
    private Integer frames;
    private String queenRace;
    private LocalDate queenAcceptAt;
    private Integer hiveBodiesOfCreation;
    private Integer hiveBodiesOfHoney;
}
