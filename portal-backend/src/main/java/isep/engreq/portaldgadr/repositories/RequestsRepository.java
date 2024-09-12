package isep.engreq.portaldgadr.repositories;

import isep.engreq.portaldgadr.documents.CreateApiaryRequestDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RequestsRepository extends MongoRepository<CreateApiaryRequestDocument, String> {

    Optional<CreateApiaryRequestDocument> findByIdAndInControlledZone(String id, boolean inControlledZone);

}
