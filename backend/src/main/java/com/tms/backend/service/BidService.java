package com.tms.backend.service;

import com.tms.backend.dto.BidDto;
import com.tms.backend.entity.Bid;
import com.tms.backend.entity.Tender;
import com.tms.backend.entity.User;
import com.tms.backend.enums.BidStatus;
import com.tms.backend.exception.ResourceNotFoundException;
import com.tms.backend.repository.BidRepository;
import com.tms.backend.repository.TenderRepository;
import com.tms.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public BidDto submitBid(Long tenderId, BidDto bidDto, String email) {
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id " + tenderId));
        
        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        Bid bid = modelMapper.map(bidDto, Bid.class);
        bid.setTender(tender);
        bid.setVendor(vendor);
        bid.setStatus(BidStatus.PENDING);

        Bid savedBid = bidRepository.save(bid);
        
        BidDto response = modelMapper.map(savedBid, BidDto.class);
        response.setTenderId(tender.getId());
        response.setVendorEmail(vendor.getEmail());
        return response;
    }

    public List<BidDto> getBidsForTender(Long tenderId) {
        if (!tenderRepository.existsById(tenderId)) {
            throw new ResourceNotFoundException("Tender not found with id " + tenderId);
        }

        return bidRepository.findByTenderId(tenderId).stream().map(bid -> {
            BidDto dto = modelMapper.map(bid, BidDto.class);
            dto.setTenderId(bid.getTender().getId());
            dto.setVendorEmail(bid.getVendor().getEmail());
            return dto;
        }).collect(Collectors.toList());
    }

    public BidDto updateBidStatus(Long bidId, BidStatus status) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id " + bidId));

        bid.setStatus(status);
        Bid updatedBid = bidRepository.save(bid);

        BidDto dto = modelMapper.map(updatedBid, BidDto.class);
        dto.setTenderId(updatedBid.getTender().getId());
        dto.setVendorEmail(updatedBid.getVendor().getEmail());
        return dto;
    }
}
