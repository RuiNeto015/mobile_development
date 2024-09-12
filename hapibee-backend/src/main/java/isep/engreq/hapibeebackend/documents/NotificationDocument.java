package isep.engreq.hapibeebackend.documents;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "notification")
@AllArgsConstructor
public class NotificationDocument {
    private String title;
    private String body;
    private LocalDate date;
    private String hour;
    private String tenantId;
}
