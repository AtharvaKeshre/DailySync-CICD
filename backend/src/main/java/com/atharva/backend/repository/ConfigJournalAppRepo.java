package com.atharva.backend.repository;
import com.atharva.backend.entity.ConfigJournalAppEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;

@Component
public interface ConfigJournalAppRepo extends MongoRepository<ConfigJournalAppEntity, ObjectId>{


}
