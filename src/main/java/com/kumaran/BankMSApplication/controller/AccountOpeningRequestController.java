package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.AccountOpeningRequestDto;
import com.kumaran.BankMSApplication.service.AccountOpeningRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class AccountOpeningRequestController {

    private final AccountOpeningRequestService accountOpeningRequestService;

//    @PostMapping(
//            value = "/account-opening",
//            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public String submitRequest(
//
//            @RequestPart("request")
//            AccountOpeningRequestDto dto,
//
//            @RequestPart("aadhaar")
//            MultipartFile aadhaar,
//
//            Authentication authentication) {
//
//        String email = authentication.getName();
//
//        return accountOpeningRequestService
//                .submitRequest(dto, email, aadhaar);
//    }

    @PostMapping(
            value = "/account-opening",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String submitRequest(

            @RequestPart("request") AccountOpeningRequestDto dto,
            @RequestPart("aadhaar") MultipartFile aadhaar,
            Authentication authentication) {

        System.out.println("Authentication = " + authentication);
        System.out.println("Email = " + authentication.getName());

        return accountOpeningRequestService.submitRequest(
                dto,
                authentication.getName(),
                aadhaar
        );
    }

    @GetMapping("/aadhaar/{fileName}")
    public ResponseEntity<Resource> download(
            @PathVariable String fileName) throws Exception {

        Path path = Paths.get("uploads/aadhaar").resolve(fileName);

        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        String contentType;

        if (fileName.toLowerCase().endsWith(".pdf")) {
            contentType = MediaType.APPLICATION_PDF_VALUE;
        } else if (fileName.toLowerCase().endsWith(".jpg")
                || fileName.toLowerCase().endsWith(".jpeg")) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        } else if (fileName.toLowerCase().endsWith(".png")) {
            contentType = MediaType.IMAGE_PNG_VALUE;
        } else {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }

}