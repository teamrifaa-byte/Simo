package ma.marinfo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorie")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String libelle;

    private String description;

    private String icone;
}
