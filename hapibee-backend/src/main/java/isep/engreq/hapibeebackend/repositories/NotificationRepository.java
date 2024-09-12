package isep.engreq.hapibeebackend.repositories;

import isep.engreq.hapibeebackend.documents.NotificationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<NotificationDocument, String> {
    List<NotificationDocument> findAllByTenantId(String tenantId);
}
