package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.LoginRequestDto;
import com.kumaran.BankMSApplication.dto.LoginResponseDto;
import com.kumaran.BankMSApplication.dto.UserDto;
import com.kumaran.BankMSApplication.entity.User;
import com.kumaran.BankMSApplication.enums.Role;
import com.kumaran.BankMSApplication.exception.DuplicateResourceException;
import com.kumaran.BankMSApplication.exception.InvalidOperationException;
import com.kumaran.BankMSApplication.exception.ResourceNotFoundException;
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

        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already exists");
        }

        User user = new User();

        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());

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

        User user = userRepository
                .findByEmail(loginDto.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        if (!passwordEncoder.matches(
                loginDto.getPassword(),
                user.getPassword())) {

            throw new InvalidOperationException(
                    "Invalid credentials");
        }

        String token =
                jwtService.generateToken(
                        user.getEmail());

        return new LoginResponseDto(
                token,
                user.getRole().name(),
                "Login Successful"
        );
    }
}