package com.tms.backend.controller;

import com.tms.backend.dto.TenderDto;
import com.tms.backend.service.TenderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tenders")
public class TenderController {

    @Autowired
    private TenderService tenderService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTender(@Valid @RequestBody TenderDto tenderDto, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(tenderService.createTender(tenderDto, email));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> getAllTenders() {
        return ResponseEntity.ok(tenderService.getAllTenders());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> getTenderById(@PathVariable Long id) {
        return ResponseEntity.ok(tenderService.getTenderById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTender(@PathVariable Long id, @RequestBody TenderDto tenderDto) {
        return ResponseEntity.ok(tenderService.updateTender(id, tenderDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTender(@PathVariable Long id) {
        tenderService.deleteTender(id);
        return ResponseEntity.ok().build();
    }
}
