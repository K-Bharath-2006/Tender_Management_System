package com.tms.backend.dto;

import com.tms.backend.enums.TenderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TenderDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal budget;
    private LocalDate deadline;
    private TenderStatus status;
    private String createdByEmail;
}
