package com.openclassrooms.starterjwt.unit.controllers;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    @Test
    void authenticateUser_shouldReturnJwtResponse_whenCredentialsAreValid() {
        // GIVEN
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password");

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .admin(false)
                .password("password")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        when(jwtUtils.generateJwtToken(authentication))
                .thenReturn("fake-jwt");

        User user = new User();
        user.setAdmin(false);

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        // WHEN
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // THEN
        assertEquals(200, response.getStatusCodeValue());

        JwtResponse body = (JwtResponse) response.getBody();
        assertNotNull(body);
        assertEquals("fake-jwt", body.getToken());
        assertEquals("test@test.com", body.getUsername());
        assertFalse(body.getAdmin());
    }
    @Test
    void shouldRegisterUserSuccessfully() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("password");

        when(userRepository.existsByEmail("test@test.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("password"))
                .thenReturn("encoded-password");

        ResponseEntity<?> response = authController.registerUser(request);

        assertEquals(200, response.getStatusCodeValue());
        assertInstanceOf(MessageResponse.class, response.getBody());
        assertEquals(
                "User registered successfully!",
                ((MessageResponse) response.getBody()).getMessage()
        );

        verify(userRepository).save(any(User.class));
    }
    @Test
    void shouldFailWhenEmailAlreadyExists() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");

        when(userRepository.existsByEmail("test@test.com"))
                .thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(request);

        assertEquals(400, response.getStatusCodeValue());
        assertInstanceOf(MessageResponse.class, response.getBody());
        assertEquals(
                "Error: Email is already taken!",
                ((MessageResponse) response.getBody()).getMessage()
        );

        verify(userRepository, never()).save(any());
    }
}
