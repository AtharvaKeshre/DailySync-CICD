package com.atharva.backend.controller;

import com.atharva.backend.entity.CheckList;
import com.atharva.backend.entity.User;
import com.atharva.backend.service.CheckListService;
import com.atharva.backend.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/checklist")
public class CheckListController {

    @Autowired
    private CheckListService checkListService;

    @Autowired
    private UserService userService;

    @GetMapping("/show-checkList")
    public ResponseEntity<?> getAllJournalEntriesOfUser() {
        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        List<CheckList> all = user.getCheckList();
        if(!all.isEmpty() ){
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
//    @GetMapping("/how-checkList")
//    public ResponseEntity<?> getAllJournalEntries() {
//        List<JournalEntry> je = journalEntryService.getAll();
//        if(!je.isEmpty() ){
//            return new ResponseEntity<>(je,HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }

    @PostMapping("/create-checkList")
    public ResponseEntity<CheckList> createEntry(@RequestBody CheckList myChecklist) {
        try {
            Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            checkListService.saveCheckList(myChecklist, userName);
            return new ResponseEntity<>(myChecklist, HttpStatus.CREATED);
        }
        catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping("id/{myId}")
    public ResponseEntity<?> getEntryById(@PathVariable ObjectId myId) {
        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        List<CheckList> collect = user.getCheckList().stream().filter(x -> x.getId().equals(myId)).collect(Collectors.toList());
        if(!collect.isEmpty()){
            Optional<CheckList> checkList =  checkListService.getById(myId);
            if(checkList.isPresent()){
                return new ResponseEntity<>(checkList.get(), HttpStatus.OK);
            }
        }

        return new ResponseEntity<>("Not Found!!", HttpStatus.NOT_FOUND);
    }

//    @DeleteMapping("id/{myId}")
//    public ResponseEntity<?> deleteEntryById(@PathVariable ObjectId myId){
//        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
//        String userName = authentication.getName();
//        boolean removed = checkListService.deleteById(myId, userName);
//        if(removed){
//            return new ResponseEntity<>("No Content to Display!",HttpStatus.NO_CONTENT);
//        }
//        else{
//            return new ResponseEntity<>("Not Found!!", HttpStatus.NOT_FOUND);
//        }
//    }

//    @PutMapping("id/{myId}")
//    public ResponseEntity<?> updateEntryById(@PathVariable ObjectId myId,
//                                             @RequestBody JournalEntry newEntry)
//    {
//        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
//        String userName = authentication.getName();
//        User user = userService.findByUserName(userName);
//        List<JournalEntry> collect = user.getJournalEntry().stream().filter(x -> x.getId().equals(myId)).collect(Collectors.toList());
//        if(!collect.isEmpty()){
//            Optional<JournalEntry> journalEntry =  journalEntryService.getById(myId);
//            if(journalEntry.isPresent()){
//                JournalEntry old = journalEntry.get();
//                old.setTitle(newEntry.getTitle()!= null && !newEntry.getTitle().equals("")? newEntry.getTitle() : old.getTitle() );
//                old.setContent(newEntry.getContent()!= null && !newEntry.getContent().equals("")? newEntry.getContent() : old.getContent());
//                journalEntryService.saveEntry(old);
//                return new ResponseEntity<>(old,HttpStatus.OK);
//            }
//        }
//
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
}
