package ma.marinfo.service;

import lombok.RequiredArgsConstructor;
import ma.marinfo.dto.AuthDtos.*;
import ma.marinfo.entity.Administrateur;
import ma.marinfo.entity.Client;
import ma.marinfo.exception.MetierException;
import ma.marinfo.repository.AdministrateurRepository;
import ma.marinfo.repository.ClientRepository;
import ma.marinfo.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ClientRepository clientRepo;
    private final AdministrateurRepository adminRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    @Transactional
    public AuthResponse inscrireClient(RegisterRequest r) {
        if (clientRepo.existsByEmail(r.getEmail()))
            throw new MetierException("Cet email est déjà utilisé");

        Client c = Client.builder()
                .nom(r.getNom())
                .prenom(r.getPrenom())
                .email(r.getEmail())
                .motDePasse(encoder.encode(r.getMotDePasse()))
                .telephone(r.getTelephone())
                .adresse(r.getAdresse())
                .ville(r.getVille())
                .actif(true)
                .build();
        c = clientRepo.save(c);
        return token(c);
    }

    public AuthResponse loginClient(LoginRequest r) {
        Client c = clientRepo.findByEmail(r.getEmail())
                .orElseThrow(() -> new MetierException("Identifiants invalides"));
        if (!encoder.matches(r.getMotDePasse(), c.getMotDePasse()))
            throw new MetierException("Identifiants invalides");
        if (!Boolean.TRUE.equals(c.getActif()))
            throw new MetierException("Compte désactivé");
        return token(c);
    }

    public AuthResponse loginAdmin(LoginRequest r) {
        Administrateur a = adminRepo.findByEmail(r.getEmail())
                .orElseThrow(() -> new MetierException("Identifiants invalides"));
        if (!encoder.matches(r.getMotDePasse(), a.getMotDePasse()))
            throw new MetierException("Identifiants invalides");

        return AuthResponse.builder()
                .token(jwt.generer(a.getEmail(), "ADMIN", a.getId()))
                .role("ADMIN")
                .userId(a.getId())
                .email(a.getEmail())
                .nomComplet(a.getNom())
                .build();
    }

    private AuthResponse token(Client c) {
        return AuthResponse.builder()
                .token(jwt.generer(c.getEmail(), "CLIENT", c.getId()))
                .role("CLIENT")
                .userId(c.getId())
                .email(c.getEmail())
                .nomComplet(c.getPrenom() + " " + c.getNom())
                .build();
    }
}
