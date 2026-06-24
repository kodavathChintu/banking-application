package com.kumaran.BankMSApplication.entity;

import com.kumaran.BankMSApplication.enums.CustomerStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String mobileNumber;

    private String gender;

    @Column(unique = true, nullable = false)
    private String email;

    private String address;

    private String aadhaarFilePath;

    @Enumerated(EnumType.STRING)
    private CustomerStatus status = CustomerStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "bank_id")
    private Bank bank;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}