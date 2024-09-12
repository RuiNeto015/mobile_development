package isep.engreq.hapibeebackend.documents;

import isep.engreq.hapibeebackend.models.apiary.ApiaryEvent;
import isep.engreq.hapibeebackend.models.beehive.Beehive;
import isep.engreq.hapibeebackend.models.common.GeoLocation;
import isep.engreq.hapibeebackend.models.enums.ApiaryStateEnum;
import isep.engreq.hapibeebackend.models.enums.BeehiveStructureType;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Document(collection = "apiaries")
public class ApiaryDocument {

    @MongoId
    private String id;
    private String name;
    private String tenantId;
    private List<Beehive> beehives;
    private String town; //"freguesia"
    private GeoLocation geoLocation;
    private String nameOfLocal; //"nome do lugar"
    private boolean intensiveCultivation;
    private boolean inControlledZone;
    private String controlledZoneName;
    private Integer beehivesCount;
    private Integer coresCount; //"núcleos/cortiços"
    private LocalDateTime creationDate;
    private List<ApiaryEvent> apiaryHistory;
    private String md5;
    private LocalDateTime changedAt;
    private ApiaryStateEnum status;

    public void addEvent(ApiaryEvent event) {
        this.apiaryHistory.add(event);
    }

    public void setBeehives(List<Beehive> beehives) {
        if (beehives != null) {
            this.checkBeehivesNames(beehives);
            this.beehivesCount = 0;
            this.coresCount = 0;
            beehives.forEach(beehive -> {
                if (beehive.getStructureType().equals(BeehiveStructureType.NORMAL)) {
                    this.beehivesCount++;
                } else {
                    this.coresCount++;
                }
            });
            this.beehives = beehives;
        }
    }

    private void checkBeehivesNames(List<Beehive> beehives) {
        Set<String> uniqueNames = new HashSet<>();

        for (Beehive beehive : beehives) {
            if (!uniqueNames.add(beehive.getName())) {
                throw new IllegalArgumentException("Todas as colmeias devem ter nome único! " + beehive.getName() + " é repetido.");
            }
        }
    }

    public void updateEvent(UUID id, ApiaryEvent updatedEvent) {

    }

}
