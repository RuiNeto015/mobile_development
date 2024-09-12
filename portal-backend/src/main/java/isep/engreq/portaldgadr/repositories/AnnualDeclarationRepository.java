package isep.engreq.portaldgadr.repositories;

import isep.engreq.portaldgadr.documents.EmitAnnualDeclarationRequestDocument;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnualDeclarationRepository extends MongoRepository<EmitAnnualDeclarationRequestDocument, String> {
}