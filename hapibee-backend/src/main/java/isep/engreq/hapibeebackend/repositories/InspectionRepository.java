package isep.engreq.hapibeebackend.repositories;

import isep.engreq.hapibeebackend.documents.InspectionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRepository extends MongoRepository<InspectionDocument, String> {

    List<InspectionDocument> findAllByApiaryId(String id);

    List<InspectionDocument> findAllByApiaryIdAndHivesHiveId(String apiaryId, String hiveId);

}
