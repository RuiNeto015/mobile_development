package isep.engreq.hapibeebackend.dtos;

import isep.engreq.hapibeebackend.models.common.GeoLocation;
import isep.engreq.hapibeebackend.models.enums.ApiaryStateEnum;
import lombok.Data;

@Data
public class AnnualDeclarationApiaryDto {

    private String id;
    private String town;
    private GeoLocation geoLocation;
    private String nameOfLocal;
    private boolean intensiveCultivation;
    private Integer beehivesCount;
    private Integer coresCount;
    private boolean inTranshumance;
    private boolean inControlledZone;
    private ApiaryStateEnum state;
}
