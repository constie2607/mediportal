package com.consdev.mediportal.controller;

import com.consdev.mediportal.entities.Message;
import com.consdev.mediportal.entities.User;
import com.consdev.mediportal.repository.MessageRepository;
import com.consdev.mediportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient/messages")
public class PatientMessagesController {

    private final MessageRepository messageRepo;
    private final UserRepository userRepo;

    public PatientMessagesController(MessageRepository messageRepo, UserRepository userRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<?> myMessages(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String principal = auth.getName(); // could be email OR id
        User me = null;

        // Try email first
        if (principal != null && principal.contains("@")) {
            me = userRepo.findByEmail(principal).orElse(null);
        }

        // Fallback: try as userId
        if (me == null && principal != null) {
            me = userRepo.findById(principal).orElse(null);
        }

        if (me == null) {
            return ResponseEntity.status(401).body("Unauthorized (user not found)");
        }

        return ResponseEntity.ok(
                messageRepo.findByToUserIdOrderByCreatedAtDesc(me.getId())
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable String id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String principal = auth.getName();
        User me = null;

        if (principal != null && principal.contains("@")) {
            me = userRepo.findByEmail(principal).orElse(null);
        }
        if (me == null && principal != null) {
            me = userRepo.findById(principal).orElse(null);
        }
        if (me == null) return ResponseEntity.status(401).body("Unauthorized (user not found)");

        Message msg = messageRepo.findById((id)).orElse(null);
        if (msg == null) return ResponseEntity.status(404).body("Not found");

        if (!me.getId().equals(msg.getToUserId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        msg.setReadFlag(true);
        messageRepo.save(msg);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String principal = auth.getName();
        User me = null;

        if (principal != null && principal.contains("@")) {
            me = userRepo.findByEmail(principal).orElse(null);
        }
        if (me == null && principal != null) {
            me = userRepo.findById(principal).orElse(null);
        }
        if (me == null) return ResponseEntity.status(401).body("Unauthorized (user not found)");

        long count = messageRepo.countByToUserIdAndReadFlagFalse(me.getId());
        return ResponseEntity.ok(count);
    }
}
