package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "livraison")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Livraison {

    public enum Etat { EN_PREPARATION, EXPEDIEE, LIVREE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "lignes"})
    private Commande commande;

    @Column(name = "date_envoi")
    private LocalDateTime dateEnvoi;

    @Column(name = "date_reception")
    private LocalDateTime dateReception;

    private String transporteur;

    @Column(name = "numero_suivi")
    private String numeroSuivi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Etat etat = Etat.EN_PREPARATION;

    @Column(nullable = false)
    private Boolean partielle = false;
}
