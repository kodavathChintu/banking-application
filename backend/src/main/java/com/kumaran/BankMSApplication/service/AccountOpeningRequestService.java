package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.AccountOpeningRequestDto;
import org.springframework.web.multipart.MultipartFile;

public interface AccountOpeningRequestService {


    String submitRequest(
            AccountOpeningRequestDto dto,
            String email,
            MultipartFile aadhaar);
}