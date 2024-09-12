package isep.engreq.portaldgadr.dtos;

import lombok.Data;

@Data
public class UserDto {

    private String tenantId;

    private String email;

    private String password;

    private String name;

    private String role;

    private String nif;

    private String address;
}

