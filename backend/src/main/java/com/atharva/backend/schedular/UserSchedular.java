package com.atharva.backend.schedular;

import com.atharva.backend.cache.AppCache;
import com.atharva.backend.entity.JournalEntry;
import com.atharva.backend.entity.User;
import com.atharva.backend.enums.Sentiment;
import com.atharva.backend.model.SentimentData;
import com.atharva.backend.repository.UserRepoImpl;
import com.atharva.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class UserSchedular {
    @Autowired
    private EmailService emailService;

    @Autowired
    private AppCache appCache;

    @Autowired
    private KafkaTemplate<String, SentimentData> kafkaTemplate;


    @Autowired
    private UserRepoImpl userRepoImpl;

//    @Scheduled(cron = "0 0 9 * * SUN")
    public void fetchUserAndSendSAEmail(){
        List<User> userForSA = userRepoImpl.getUserForSA();
        for(User user : userForSA){
            List<JournalEntry> journalEntry = user.getJournalEntry();
            List<Sentiment> sentiments = journalEntry.stream().filter(x -> x.getDate().isAfter(LocalDateTime.now().minus(180, ChronoUnit.DAYS))).map(x -> x.getSentiment()).collect(Collectors.toList());

            Map<Sentiment,Integer> sentimentCounts = new HashMap<>();
            for(Sentiment sentiment : sentiments){
                if(sentiment!=null)
                    sentimentCounts.put(sentiment,sentimentCounts.getOrDefault(sentiment,0)+1);
            }
            Sentiment mostFrequentSentiment = null;
            int maxCount = 0;
            for(Map.Entry<Sentiment,Integer> entry : sentimentCounts.entrySet()){
                if(entry.getValue()>maxCount){
                    maxCount = entry.getValue();
                    mostFrequentSentiment = entry.getKey();
                }
            }
            if(mostFrequentSentiment!=null){
                emailService.sendEmail(user.getEmail(),"Sentiment for the last 90 days", mostFrequentSentiment.toString());
//                SentimentData sentimentData = SentimentData.builder().email(user.getEmail()).sentiment("Sentiment for last 90 days " + mostFrequentSentiment).build();
//                try{
//                    kafkaTemplate.send("weekly_sentiments", sentimentData.getEmail(), sentimentData);
//                }
//                catch(Exception e){
//                    emailService.sendEmail(user.getEmail(),"Sentiment for the last 90 days", mostFrequentSentiment.toString());
//                }

//                emailService.sendEmail(user.getEmail(),"Sentiment for the last 7 days", mostFrequentSentiment.toString());
            }
        }

    }
    @Scheduled(cron = "0 */10 * * * *")
    public void clearAppCache(){
        appCache.init();
    }
}
