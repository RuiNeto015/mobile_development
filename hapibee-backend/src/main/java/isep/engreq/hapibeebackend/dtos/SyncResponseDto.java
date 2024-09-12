package isep.engreq.hapibeebackend.dtos;

import isep.engreq.hapibeebackend.documents.ApiaryDocument;
import isep.engreq.hapibeebackend.documents.InspectionDocument;
import lombok.Data;

import java.util.List;

@Data
public class SyncResponseDto {

    private List<ApiaryDocument> apiaries;
    private List<InspectionDocument> inspections;

}
