package isep.engreq.hapibeebackend.bootstrap;

import isep.engreq.hapibeebackend.documents.UserDocument;
import isep.engreq.hapibeebackend.models.enums.RoleEnum;
import isep.engreq.hapibeebackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("bootstrap")
@RequiredArgsConstructor
public class UserBootstrap implements CommandLineRunner {

    private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (this.userRepository.findByEmail("admin@mail.com").isEmpty()) {
            UserDocument admin = new UserDocument();
            admin.setTenantId("qwertyuiop");
            admin.setEmail("admin@mail.com");
            admin.setPassword(encoder.encode("password"));
            admin.setName("Administrador");
            admin.setRole(String.valueOf(RoleEnum.ADMIN));
            admin.setNif("123456789");
            admin.setAddress("Rua dos Administradores");

            this.userRepository.save(admin);
        }
    }
}
