package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrateur")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Administrateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nom;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @JsonIgnore
    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Column(nullable = false, length = 30)
    private String role = "ADMIN";
}
