package isep.engreq.hapibeebackend.models.apiary;

import isep.engreq.hapibeebackend.models.enums.ApiaryEventType;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class ApiaryTranshumanceEvent extends ApiaryEvent {

    private String district;
    private String county;
    private String parish;
    private String place;
    private String destLat;
    private String destLong;
    private String carPlate;
    private Date travelDate;
    private String travelDuration;
    private boolean controlledZone;
    private List<ApiaryTranshumanceEventApprovals> approvals;

    public ApiaryTranshumanceEvent(String district, String county, String parish, String destLat, String destLong,
                                   String carPlate, Date travelDate, String travelDuration, boolean controlledZone,
                                   String place) {
        super(ApiaryEventType.REQUEST_TO_TRANSHUMANCE);
        this.district = district;
        this.county = county;
        this.parish = parish;
        this.destLat = destLat;
        this.destLong = destLong;
        this.carPlate = carPlate;
        this.travelDate = travelDate;
        this.travelDuration = travelDuration;
        this.controlledZone = controlledZone;
        this.place = place;
        this.approvals = new ArrayList<>();
    }
}
