package isep.engreq.hapibeebackend.dtos;

import isep.engreq.hapibeebackend.documents.InspectionDocument;
import lombok.Data;

import java.util.List;

@Data
public class SyncRequestDto {

    private String tenantId;
    private List<ApiaryDto> apiaries;
    private List<InspectionDocument> inspections;

}
