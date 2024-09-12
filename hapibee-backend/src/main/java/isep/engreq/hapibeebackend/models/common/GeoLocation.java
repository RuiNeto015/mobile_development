package isep.engreq.hapibeebackend.models.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GeoLocation {

    private double latitude;
    private double longitude;

}
