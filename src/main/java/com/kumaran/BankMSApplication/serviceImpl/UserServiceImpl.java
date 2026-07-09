package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.LoginRequestDto;
import com.kumaran.BankMSApplication.dto.LoginResponseDto;
import com.kumaran.BankMSApplication.dto.UserDto;
import com.kumaran.BankMSApplication.entity.User;
import com.kumaran.BankMSApplication.enums.Role;
import com.kumaran.BankMSApplication.repository.UserRepository;
import com.kumaran.BankMSApplication.security.JwtService;
import com.kumaran.BankMSApplication.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    @Override
    public String registerCustomer(UserDto userDto) {

        String normalizedEmail = userDto.getEmail() == null
                ? null
                : userDto.getEmail().trim().toLowerCase();

        User user = new User();

        user.setFullName(userDto.getFullName());

        user.setEmail(normalizedEmail);

        user.setPassword(
                passwordEncoder.encode(userDto.getPassword())
        );

        user.setRole(Role.CUSTOMER);

        user.setActive(true);

        userRepository.save(user);

        return "Customer Registered Successfully";
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginDto) {

        String normalizedEmail = loginDto.getEmail() == null
                ? null
                : loginDto.getEmail().trim().toLowerCase();

        User user = userRepository
                .findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));

        if (!passwordEncoder.matches(
                loginDto.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid Credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponseDto(
                token,
                user.getRole().name(),
                "Login Successful",
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getActive()
        );
    }
}