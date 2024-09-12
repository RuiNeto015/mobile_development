package isep.engreq.hapibeebackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Getter
public class TranshumanceDto {
    private String district;
    private String county;
    private String parish;
    private String destLat;
    private String destLong;
    private String carPlate;
    private Date travelDate;
    private String travelDuration;
    private boolean controlledZone;
}
