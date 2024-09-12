package isep.engreq.hapibeebackend.dtos;

import isep.engreq.hapibeebackend.models.apiary.ApiaryEvent;
import isep.engreq.hapibeebackend.models.beehive.Beehive;
import isep.engreq.hapibeebackend.models.common.GeoLocation;
import isep.engreq.hapibeebackend.models.enums.ApiaryStateEnum;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ApiaryDto {

    private String id;
    private String name;
    private String tenantId;
    private List<Beehive> beehives;
    private String town; // "freguesia"
    private GeoLocation geoLocation;
    private String nameOfLocal; // "nome do lugar"
    private boolean intensiveCultivation;
    private boolean inControlledZone;
    private String controlledZoneName;
    private Integer beehivesCount;
    private Integer coresCount; // "núcleos/cortiços"
    private LocalDateTime creationDate;
    private List<ApiaryEvent> apiaryHistory;
    private String md5;
    private LocalDateTime changedAt;
    private ApiaryStateEnum status;
    private boolean inTranshumance;
}
