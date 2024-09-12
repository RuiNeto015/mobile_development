package isep.engreq.hapibeebackend.documents;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Data
@Document(collection = "users")
public class UserDocument {

    @MongoId
    private String id;

    private String tenantId;

    private String email;

    private String password;

    private String name;

    private String role;

    private String nif;

    private String address;
}
