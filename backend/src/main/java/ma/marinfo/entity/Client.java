package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "client")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nom;

    @Column(nullable = false, length = 80)
    private String prenom;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @JsonIgnore
    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    private String telephone;
    private String adresse;
    private String ville;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    private Boolean actif = true;
}
