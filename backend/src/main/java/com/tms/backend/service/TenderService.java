package com.tms.backend.service;

import com.tms.backend.dto.TenderDto;
import com.tms.backend.entity.Tender;
import com.tms.backend.entity.User;
import com.tms.backend.enums.TenderStatus;
import com.tms.backend.exception.ResourceNotFoundException;
import com.tms.backend.repository.TenderRepository;
import com.tms.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenderService {

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public TenderDto createTender(TenderDto tenderDto, String email) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        Tender tender = modelMapper.map(tenderDto, Tender.class);
        tender.setCreatedBy(admin);
        tender.setStatus(TenderStatus.OPEN);

        Tender savedTender = tenderRepository.save(tender);
        
        TenderDto response = modelMapper.map(savedTender, TenderDto.class);
        response.setCreatedByEmail(admin.getEmail());
        return response;
    }

    public List<TenderDto> getAllTenders() {
        return tenderRepository.findAll().stream().map(tender -> {
            TenderDto dto = modelMapper.map(tender, TenderDto.class);
            dto.setCreatedByEmail(tender.getCreatedBy().getEmail());
            return dto;
        }).collect(Collectors.toList());
    }

    public TenderDto getTenderById(Long id) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id " + id));
        TenderDto dto = modelMapper.map(tender, TenderDto.class);
        dto.setCreatedByEmail(tender.getCreatedBy().getEmail());
        return dto;
    }

    public TenderDto updateTender(Long id, TenderDto tenderDto) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id " + id));

        tender.setTitle(tenderDto.getTitle());
        tender.setDescription(tenderDto.getDescription());
        tender.setBudget(tenderDto.getBudget());
        tender.setDeadline(tenderDto.getDeadline());

        if(tenderDto.getStatus() != null) {
            tender.setStatus(tenderDto.getStatus());
        }

        Tender updatedTender = tenderRepository.save(tender);
        TenderDto dto = modelMapper.map(updatedTender, TenderDto.class);
        dto.setCreatedByEmail(updatedTender.getCreatedBy().getEmail());
        return dto;
    }

    public void deleteTender(Long id) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id " + id));
        tenderRepository.delete(tender);
    }
}
