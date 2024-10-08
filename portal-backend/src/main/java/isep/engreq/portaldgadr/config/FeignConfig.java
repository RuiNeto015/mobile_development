package isep.engreq.portaldgadr.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@EnableFeignClients(basePackages="isep.engreq.portaldgadr.client")
@Configuration
public class FeignConfig {
}
