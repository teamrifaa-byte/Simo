package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reapprovisionnement")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reapprovisionnement {

    public enum Etat { EN_ATTENTE, RECU, ANNULE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "article_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Article article;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "date_demande")
    private LocalDateTime dateDemande = LocalDateTime.now();

    @Column(name = "date_reception")
    private LocalDateTime dateReception;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Etat etat = Etat.EN_ATTENTE;

    private String fournisseur;
}
