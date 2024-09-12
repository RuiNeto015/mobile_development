package isep.engreq.hapibeebackend.repositories;

import isep.engreq.hapibeebackend.documents.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserDocument, String> {

    Optional<UserDocument> findByEmail(String email);

    Optional<UserDocument> findByRoleAndTenantId(String role, String tenantId);

    Optional<UserDocument> findByTenantIdAndEmail(String tenantId, String email);

    void deleteByTenantIdAndEmail(String tenantId, String email);

    List<UserDocument> findAllByTenantId(String tenantId);
}
