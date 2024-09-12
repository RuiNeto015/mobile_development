package isep.engreq.hapibeebackend.dtos;

import isep.engreq.hapibeebackend.models.common.GeoLocation;
import lombok.Data;

import java.util.List;

@Data
public class CreateApiaryDto {

    private String name;
    private String tenantId;
    private List<CreateBeehiveDto> beehives;
    private String town; //"freguesia"
    private GeoLocation geoLocation;
    private String nameOfLocal; //"nome do lugar"
    private boolean intensiveCultivation;
    private boolean inControlledZone;

}
