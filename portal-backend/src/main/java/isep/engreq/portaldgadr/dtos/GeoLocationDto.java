package isep.engreq.portaldgadr.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GeoLocationDto {

    private double latitude;
    private double longitude;

}
