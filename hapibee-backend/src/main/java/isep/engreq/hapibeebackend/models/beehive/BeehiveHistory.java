package isep.engreq.hapibeebackend.models.beehive;

import isep.engreq.hapibeebackend.models.enums.HoneyPollenEnum;
import isep.engreq.hapibeebackend.models.enums.NestEnum;
import isep.engreq.hapibeebackend.models.enums.PopulationBeehiveEnum;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BeehiveHistory {

    private String author;
    private LocalDateTime localDateTime;
    private String interventionType;
    private PopulationBeehiveEnum levelOfBeehivePopulation;
    private HoneyPollenEnum levelOfPollenAndHoney;
    private NestEnum levelOfNest;
    private List<String> diseases;
    private String symptoms;
    private String notes;
    private boolean dgavNotified;
}
