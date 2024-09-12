package isep.engreq.hapibeebackend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import isep.engreq.hapibeebackend.documents.AnnualDeclarationDocument;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnualDeclarationRepository extends MongoRepository<AnnualDeclarationDocument, String> {
    
    List<AnnualDeclarationDocument> findAllByTenantId(String tenantId);

    Optional<AnnualDeclarationDocument> findByIdAndAnnualDeclarationHistoryId(String annualDeclarationId,
            String requestId);
}