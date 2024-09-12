package isep.engreq.hapibeebackend.dtos;

import lombok.Data;
import lombok.Getter;

import java.util.Date;

@Getter
public class CreateTranshumanceDto {
    private String apiaryId;
    private String district;
    private String county;
    private String parish;
    private String destLat;
    private String destLong;
    private String carPlate;
    private Date travelDate;
    private String travelDuration;
}
