package com.kumaran.BankMSApplication.repository;

import com.kumaran.BankMSApplication.entity.AccountOpeningRequest;
import com.kumaran.BankMSApplication.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountOpeningRequestRepository extends JpaRepository<AccountOpeningRequest, Long> {

    List<AccountOpeningRequest> findByRequestStatus(RequestStatus requestStatus);

    Long countByRequestStatus(RequestStatus requestStatus);

    List<AccountOpeningRequest> findByUserUserId(Long userId);
}