package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiement")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Paiement {

    public enum Methode { CARTE_BANCAIRE, VIREMENT, PAIEMENT_LIVRAISON }
    public enum Etat    { VALIDE, ECHEC, REMBOURSE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "lignes"})
    private Commande commande;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Methode methode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Etat etat = Etat.VALIDE;

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement = LocalDateTime.now();

    private String reference;
}
