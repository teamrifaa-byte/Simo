package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private LocalDateTime dateCommande = LocalDateTime.now();

    @Builder.Default
    private BigDecimal montantTotal = BigDecimal.ZERO;

    @Builder.Default
    private String etat = "EN_ATTENTE";

    private String adresseLivraison;
    private String villeLivraison;
    private String methodePaiement;

    private String numero;

    @Builder.Default
    private boolean accuseRecu = false;

    private LocalDateTime dateAccuse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties({"commandes", "hibernateLazyInitializer", "handler"})
    private Client client;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnoreProperties({"commande", "hibernateLazyInitializer", "handler"})
    private List<LigneCommande> lignes = new ArrayList<>();
}