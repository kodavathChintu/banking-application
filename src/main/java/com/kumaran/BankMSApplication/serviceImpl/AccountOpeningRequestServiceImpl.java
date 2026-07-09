package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.AccountOpeningRequestDto;
import com.kumaran.BankMSApplication.entity.AccountOpeningRequest;
import com.kumaran.BankMSApplication.entity.Bank;
import com.kumaran.BankMSApplication.entity.Customer;
import com.kumaran.BankMSApplication.entity.User;
import com.kumaran.BankMSApplication.enums.RequestStatus;
import com.kumaran.BankMSApplication.repository.AccountOpeningRequestRepository;
import com.kumaran.BankMSApplication.repository.BankRepository;
import com.kumaran.BankMSApplication.repository.CustomerRepository;
import com.kumaran.BankMSApplication.repository.UserRepository;
import com.kumaran.BankMSApplication.service.AccountOpeningRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.kumaran.BankMSApplication.enums.CustomerStatus;
import com.kumaran.BankMSApplication.exception.CustomerInactiveException;
import com.kumaran.BankMSApplication.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.io.File;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AccountOpeningRequestServiceImpl implements AccountOpeningRequestService {

    private final AccountOpeningRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final BankRepository bankRepository;
    private final CustomerRepository customerRepository;

    @Override
    public String submitRequest(
            AccountOpeningRequestDto dto,
            String customerEmail,
            MultipartFile aadhaar) {

        // ===== DEBUG START =====
        System.out.println("========== ACCOUNT OPENING ==========");
        System.out.println("Customer Email = " + customerEmail);
        System.out.println("DTO = " + dto);

        if (dto != null) {
            System.out.println("BankId = " + dto.getBankId());
        }

        if (aadhaar != null) {
            System.out.println("File = " + aadhaar.getOriginalFilename());
            System.out.println("Content Type = " + aadhaar.getContentType());
            System.out.println("File Size = " + aadhaar.getSize());
        } else {
            System.out.println("Aadhaar file is NULL");
        }
        // ===== DEBUG END =====

        String normalizedEmail = customerEmail == null
                ? null
                : customerEmail.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        Bank bank = bankRepository.findById(dto.getBankId())
                .orElseThrow(() -> new ResourceNotFoundException("Bank Not Found"));
        Customer customer = customerRepository
                .findByUserAndBank(user, bank)
                .orElse(null);

        if(customer != null &&
                customer.getStatus() == CustomerStatus.REJECTED){

            throw new CustomerInactiveException(
                    "Customer Is Deactivated. Cannot Open New Account"
            );
        }

        AccountOpeningRequest pending =
                requestRepository.findTopByUserAndBankOrderByRequestIdDesc(user, bank);

        if (pending != null &&
                pending.getRequestStatus() == RequestStatus.PENDING) throw new RuntimeException(
                "You already have a pending account opening request."
        );



        Optional<Customer> existing =
                customerRepository.findByUserAndBank(user, bank);

        if (customerRepository.findByUserAndBank(user, bank).isPresent()) {
            throw new RuntimeException("Account already exists for this bank");
        }
        AccountOpeningRequest newRequest = new AccountOpeningRequest();

        newRequest.setCustomerName(dto.getCustomerName());
        newRequest.setMobileNumber(dto.getMobileNumber());
        newRequest.setGender(dto.getGender());
        newRequest.setEmail(dto.getEmail());
        newRequest.setAddress(dto.getAddress());
        newRequest.setAccountType(dto.getAccountType());
        newRequest.setRequestStatus(RequestStatus.PENDING);
        newRequest.setBank(bank);
        newRequest.setUser(user);

        if (aadhaar == null || aadhaar.isEmpty()) {
            throw new RuntimeException("Please upload Aadhaar file.");
        }

        String contentType = aadhaar.getContentType();

        if (contentType == null ||
                !(contentType.equals("application/pdf") ||
                        contentType.equals("image/jpeg") ||
                        contentType.equals("image/png"))) {

            throw new RuntimeException(
                    "Only PDF, JPG and PNG files are allowed.");
        }

        long maxSize = 5 * 1024 * 1024;

        if (aadhaar.getSize() > maxSize) {
            throw new RuntimeException(
                    "Aadhaar file size should not exceed 5 MB.");
        }

        String uploadDir = "uploads/aadhaar/";

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + aadhaar.getOriginalFilename();

        Path path =
                Paths.get(uploadDir + fileName);

        try {

            Files.copy(
                    aadhaar.getInputStream(),
                    path,
                    StandardCopyOption.REPLACE_EXISTING
            );

            newRequest.setAadhaarFileName(fileName);

        } catch (IOException e) {

            throw new RuntimeException("Failed to upload Aadhaar file", e);

        }
        System.out.println("Saving Request...");
        requestRepository.save(newRequest);
        System.out.println("Saved Successfully");
        return "Account Opening Request Submitted Successfully";
    }
}