package isep.engreq.hapibeebackend.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@EnableFeignClients(basePackages="isep.engreq.hapibeebackend.clients")
@Configuration
public class FeignConfig {
}
