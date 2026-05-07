package com.tms.backend.controller;

import com.tms.backend.dto.BidDto;
import com.tms.backend.enums.BidStatus;
import com.tms.backend.service.BidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping("/tenders/{tenderId}/bids")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> submitBid(@PathVariable Long tenderId, @Valid @RequestBody BidDto bidDto, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(bidService.submitBid(tenderId, bidDto, email));
    }

    @GetMapping("/tenders/{tenderId}/bids")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> getBidsForTender(@PathVariable Long tenderId) {
        return ResponseEntity.ok(bidService.getBidsForTender(tenderId));
    }

    @PutMapping("/bids/{bidId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBidStatus(@PathVariable Long bidId, @RequestBody Map<String, String> statusUpdate) {
        BidStatus newStatus = BidStatus.valueOf(statusUpdate.get("status").toUpperCase());
        return ResponseEntity.ok(bidService.updateBidStatus(bidId, newStatus));
    }
}
