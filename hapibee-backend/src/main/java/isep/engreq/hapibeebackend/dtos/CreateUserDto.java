package isep.engreq.hapibeebackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateUserDto {

    private String tenantId;

    private String email;

    private String password;

    private String name;

    private String role;

    private String nif;

    private String address;
}
