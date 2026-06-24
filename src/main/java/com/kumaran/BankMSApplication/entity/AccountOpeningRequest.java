package com.kumaran.BankMSApplication.entity;

import com.kumaran.BankMSApplication.enums.AccountType;
import com.kumaran.BankMSApplication.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account_opening_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountOpeningRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String mobileNumber;

    private String gender;

    private String aadhaarFileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus requestStatus = RequestStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "bank_id")
    private Bank bank;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String address;
}