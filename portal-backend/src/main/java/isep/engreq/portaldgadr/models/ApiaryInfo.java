package isep.engreq.portaldgadr.models;


import isep.engreq.portaldgadr.dtos.GeoLocationDto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApiaryInfo {

    private String id;
    private String name;
    private String town; //"freguesia"
    private GeoLocationDto geoLocation;
    private String nameOfLocal; //"nome do lugar"
    private boolean intensiveCultivation;
    private Integer beehivesCount;
    private Integer coresCount; //"núcleos/cortiços"
    private LocalDate creationDate;

}
