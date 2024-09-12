package isep.engreq.hapibeebackend.bootstrap;

import isep.engreq.hapibeebackend.documents.AnnualDeclarationDocument;
import isep.engreq.hapibeebackend.dtos.AnnualDeclarationApiaryDto;
import isep.engreq.hapibeebackend.dtos.UserDto;
import isep.engreq.hapibeebackend.models.annualDeclaration.AnnualDeclarationEvent;
import isep.engreq.hapibeebackend.models.enums.AnnualDeclarationState;
import isep.engreq.hapibeebackend.models.enums.AnnualDeclarationType;
import isep.engreq.hapibeebackend.models.enums.RoleEnum;
import isep.engreq.hapibeebackend.repositories.AnnualDeclarationRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("bootstrap")
@RequiredArgsConstructor
public class AnnualDeclarationBootstrap implements CommandLineRunner {

    private final AnnualDeclarationRepository annualDeclarationRepository;

    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {

        UserDto admin = new UserDto();
        admin.setTenantId("qwertyuiop");
        admin.setEmail("admin@mail.com");
        admin.setPassword(encoder.encode("password"));
        admin.setName("Administrador");
        admin.setRole(String.valueOf(RoleEnum.ADMIN));
        admin.setNif("123456789");
        admin.setAddress("Rua dos Administradores");

        if (annualDeclarationRepository.findById("fff7e8ac-8eb7-11ee-b9d1-0563ac120002").isEmpty()) {
            AnnualDeclarationDocument annualDeclarationDocument1 = new AnnualDeclarationDocument();
            annualDeclarationDocument1.setId("fff7e8ac-8eb7-11ee-b9d1-0563ac120002");
            annualDeclarationDocument1.setTenantId("qwertyuiop");
            annualDeclarationDocument1.setType(AnnualDeclarationType.BEEKEEPER_INITIAL_REGISTRY);
            annualDeclarationDocument1.setActivityStartDate(LocalDate.parse("2019-09-01"));
            annualDeclarationDocument1.setActivityEndDate(LocalDate.parse("2020-09-01"));
            annualDeclarationDocument1.setUser(admin);
            annualDeclarationDocument1.setApiariesList(new ArrayList<AnnualDeclarationApiaryDto>());
            annualDeclarationDocument1.setAnnualDeclarationHistory(new ArrayList<AnnualDeclarationEvent>());
            annualDeclarationDocument1.setChangedAt(LocalDateTime.now());
            annualDeclarationDocument1.setState(AnnualDeclarationState.ACCEPTED);
            annualDeclarationRepository.save(annualDeclarationDocument1);
        }

        if (annualDeclarationRepository.findById("635233a2-8ec3-11ee-d1b9-0242ac120002").isEmpty()) {
            AnnualDeclarationDocument annualDeclarationDocument2 = new AnnualDeclarationDocument();
            annualDeclarationDocument2.setId("635233a2-8ec3-11ee-d1b9-0242ac120002");
            annualDeclarationDocument2.setTenantId("qwertyuiop");
            annualDeclarationDocument2.setType(AnnualDeclarationType.ACTIVITY_RESTART);
            annualDeclarationDocument2.setActivityStartDate(LocalDate.parse("2020-09-01"));
            annualDeclarationDocument2.setActivityEndDate(LocalDate.parse("2021-09-01"));
            annualDeclarationDocument2.setUser(admin);
            annualDeclarationDocument2.setApiariesList(new ArrayList<AnnualDeclarationApiaryDto>());
            annualDeclarationDocument2.setAnnualDeclarationHistory(new ArrayList<AnnualDeclarationEvent>());
            annualDeclarationDocument2.setChangedAt(LocalDateTime.now());
            annualDeclarationDocument2.setState(AnnualDeclarationState.ACCEPTED);
            annualDeclarationRepository.save(annualDeclarationDocument2);
        }

        if (annualDeclarationRepository.findById("7e4ea0b4-8ec3-11ee-b9d1-0242ac120002").isEmpty()) {
            AnnualDeclarationDocument annualDeclarationDocument3 = new AnnualDeclarationDocument();
            annualDeclarationDocument3.setId("7e4ea0b4-8ec3-11ee-b9d1-0242ac120002");
            annualDeclarationDocument3.setTenantId("qwertyuiop");
            annualDeclarationDocument3.setType(AnnualDeclarationType.ACTIVITY_RESTART);
            annualDeclarationDocument3.setActivityStartDate(LocalDate.parse("2021-09-01"));
            annualDeclarationDocument3.setActivityEndDate(LocalDate.parse("2022-09-01"));
            annualDeclarationDocument3.setUser(admin);
            annualDeclarationDocument3.setApiariesList(new ArrayList<AnnualDeclarationApiaryDto>());
            annualDeclarationDocument3.setAnnualDeclarationHistory(new ArrayList<AnnualDeclarationEvent>());
            annualDeclarationDocument3.setChangedAt(LocalDateTime.now());
            annualDeclarationDocument3.setState(AnnualDeclarationState.ACCEPTED);
            annualDeclarationRepository.save(annualDeclarationDocument3);
        }

    }
}
