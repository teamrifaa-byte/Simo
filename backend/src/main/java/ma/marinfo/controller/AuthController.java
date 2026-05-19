package ma.marinfo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.marinfo.dto.AuthDtos.*;
import ma.marinfo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest r) {
        return ResponseEntity.ok(service.inscrireClient(r));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest r) {
        return ResponseEntity.ok(service.loginClient(r));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> loginAdmin(@Valid @RequestBody LoginRequest r) {
        return ResponseEntity.ok(service.loginAdmin(r));
    }
}
