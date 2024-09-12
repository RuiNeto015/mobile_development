package isep.engreq.hapibeebackend.bootstrap;

import isep.engreq.hapibeebackend.documents.ApiaryDocument;
import isep.engreq.hapibeebackend.models.apiary.ApiaryCreationEvent;
import isep.engreq.hapibeebackend.models.apiary.ApiaryEvent;
import isep.engreq.hapibeebackend.models.apiary.ApiaryTranshumanceEvent;
import isep.engreq.hapibeebackend.models.apiary.ApiaryTranshumanceEventApprovals;
import isep.engreq.hapibeebackend.models.beehive.Beehive;
import isep.engreq.hapibeebackend.models.common.GeoLocation;
import isep.engreq.hapibeebackend.models.enums.ApiaryStateEnum;
import isep.engreq.hapibeebackend.models.enums.BeehiveStructureType;
import isep.engreq.hapibeebackend.models.enums.EventStateEnum;
import isep.engreq.hapibeebackend.repositories.ApiaryRepository;
import isep.engreq.hapibeebackend.utils.GeneralUtils;
import isep.engreq.hapibeebackend.utils.MD5Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@Profile("bootstrap")
@RequiredArgsConstructor
public class ApiaryBootstrap implements CommandLineRunner {

    private final ApiaryRepository apiaryRepository;

    private final MD5Utils md5Utils;

    @Override
    public void run(String... args) {

        var uuidStrings = List.of(
                "fff7e8ac-8eb7-11ee-b9d1-0242ac120002",
                "635233a2-8ec3-11ee-b9d1-0242ac120002",
                "7e4ea0b4-8ec3-11ee-b9d1-0242ac120002",
                "74b90d46-8ec3-11ee-b9d1-0242ac120002"
        );

        var towns = List.of(
                "Moreira de Cónegos",
                "S.Tomé de Negrelos",
                "Vila das aves",
                "Guimarães"
        );

        for (int i = 0; i < uuidStrings.size() && apiaryRepository.findById(uuidStrings.get(i)).isEmpty(); i++) {
            // create an example ApiaryDocument
            ApiaryDocument apiary = new ApiaryDocument();
            apiary.setId(uuidStrings.get(i));
            apiary.setTenantId("qwertyuiop");
            apiary.setName("Apiário " + i);
            apiary.setBeehives(new ArrayList<>());
            apiary.setTown(towns.get(i));
            apiary.setControlledZoneName(GeneralUtils.getControlledZone());
            apiary.setInControlledZone(true);
            apiary.setGeoLocation(new GeoLocation(41.15794472, -8.629105));
            apiary.setNameOfLocal("Local X");
            apiary.setCreationDate(LocalDateTime.now().minusDays(5));
            apiary.setIntensiveCultivation(false);
            apiary.setBeehivesCount(0);
            apiary.setCoresCount(0);
            apiary.setStatus(ApiaryStateEnum.ACTIVE);

            // initialize empty lists for beehives and apiaryHistory
            Beehive beehive = new Beehive();
            beehive.setName("Colmeia 1");
            beehive.setType("Lusitana");
            beehive.setStructureType(BeehiveStructureType.NORMAL);
            beehive.setColor("Amarela");
            beehive.setSource("Aquisição");
            beehive.setFrames(10);
            beehive.setQueenRace("Italiana");
            beehive.setQueenAcceptAt(LocalDate.parse("2023-12-01"));
            beehive.setHiveBodiesOfCreation(2);
            beehive.setHiveBodiesOfHoney(1);

            var beehiveList = new ArrayList<Beehive>();
            beehiveList.add(beehive);

            apiary.setBeehives(beehiveList);

            var historic = new ArrayList<ApiaryEvent>();

            var createdEvent = new ApiaryCreationEvent();
            createdEvent.setId(UUID.randomUUID().toString());
            createdEvent.setState(EventStateEnum.APPROVED);
            createdEvent.setRequestAt(LocalDateTime.now().minusDays(25));
            createdEvent.setProcessedAt(LocalDateTime.now().minusDays(20).plusHours(17));
            createdEvent.setProcessedBy("Manuel Filipe #932132");
            createdEvent.setToControlledZone(true);
            createdEvent.setObservations("O apiário reune as condições necessárias para a sua implantação segundo o Artigo 7.º do Decreto-Lei n.º 374/2007 — 7 de Novembro de 2007!");

            historic.add(createdEvent);

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.DAY_OF_MONTH, -5);
            Date fiveDaysAgo = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, -3);
            Date twoDaysAgo = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, -1);
            Date oneDayAgo = calendar.getTime();

            if (i == 1) {
                var transhumanceEvent = new ApiaryTranshumanceEvent("1", "1", "1", "40.63929419373272", "-8.644434807266105",
                        "12-AM-32", fiveDaysAgo, "2h", true, "Aveiro");
                transhumanceEvent.setPlace("Aveiro");

                transhumanceEvent.setApprovals(new ArrayList<>());

                transhumanceEvent.getApprovals().add(new ApiaryTranshumanceEventApprovals("Filipe Lameira",
                        "Aprovado - DGAV", twoDaysAgo, true));

                transhumanceEvent.getApprovals().add(new ApiaryTranshumanceEventApprovals("Orlanda Silva",
                        "Aprovado - Zona controlada", oneDayAgo, true));

                transhumanceEvent.setState(EventStateEnum.APPROVED);

                apiary.setGeoLocation(new GeoLocation(40.63929419373272, -8.644434807266105));
                apiary.setTown("Aveiro");
                historic.add(transhumanceEvent);
            }

            apiary.setApiaryHistory(historic);
            apiary.setMd5(md5Utils.getMd5Hash(apiary));
            apiary.setChangedAt(LocalDateTime.now());

            // Save the ApiaryDocument to the database
            apiaryRepository.save(apiary);
        }


    }
}
