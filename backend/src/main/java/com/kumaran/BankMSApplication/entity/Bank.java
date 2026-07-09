package com.kumaran.BankMSApplication.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "banks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bankId;

    @Column(nullable = false)
    private String bankName;

    @Column(unique = true, nullable = false)
    private String ifscCode;

    @Column(nullable = false)
    private String branchName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Boolean active = true;
}