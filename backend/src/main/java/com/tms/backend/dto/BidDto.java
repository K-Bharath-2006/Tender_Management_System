package com.tms.backend.dto;

import com.tms.backend.enums.BidStatus;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BidDto {
    private Long id;
    private BigDecimal amount;
    private String proposal;
    private BidStatus status;
    private Long tenderId;
    private String vendorEmail;
}
