package ma.marinfo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTOs liés à l'authentification.
 * Regroupés ici pour réduire le nombre de fichiers — pratique courante en projet étudiant.
 */
public class AuthDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String motDePasse;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank @Size(min = 2, max = 80)
        private String nom;
        @NotBlank @Size(min = 2, max = 80)
        private String prenom;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6, max = 100)
        private String motDePasse;
        private String telephone;
        private String adresse;
        private String ville;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String token;
        private String role;
        private Long userId;
        private String email;
        private String nomComplet;
    }
}
