package com.atharva.backend.cache;

import com.atharva.backend.entity.ConfigJournalAppEntity;
import com.atharva.backend.repository.ConfigJournalAppRepo;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AppCache  {
    public enum keys{
        WEATHER_API;
    }
    @Autowired
    private ConfigJournalAppRepo configJournalAppRepo;
    public Map<String, String> APP_CACHE;

    @PostConstruct
    public void init() {
        APP_CACHE = new HashMap<>();
        List<ConfigJournalAppEntity> all = configJournalAppRepo.findAll();
        for(ConfigJournalAppEntity appEntity : all) {
            APP_CACHE.put(appEntity.getKey(), appEntity.getValue());
        }

    }
}
