package isep.engreq.hapibeebackend.clients.dtos;



import isep.engreq.hapibeebackend.models.common.GeoLocation;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApiaryInfoDto {

    private String id;
    private String name;
    private String town; //"freguesia"
    private GeoLocation geoLocation;
    private String nameOfLocal; //"nome do lugar"
    private boolean intensiveCultivation;
    private Integer beehivesCount;
    private Integer coresCount; //"núcleos/cortiços"
    private LocalDate creationDate;

}
