package isep.engreq.hapibeebackend.repositories;

import isep.engreq.hapibeebackend.documents.ApiaryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiaryRepository extends MongoRepository<ApiaryDocument, String> {

    Optional<ApiaryDocument> findByIdAndApiaryHistoryId(String apiaryId, String eventId);

    List<ApiaryDocument> findAllByTenantId(String tenantId);

    Optional<ApiaryDocument> findByTenantIdAndName(String tenantId, String name);

}
