package isep.engreq.hapibeebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
public class HapibeeBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HapibeeBackendApplication.class, args);
    }

}
