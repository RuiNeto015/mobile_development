package isep.engreq.hapibeebackend.clients.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FirebaseNotificationBody {
    String title;
    String body;
}
