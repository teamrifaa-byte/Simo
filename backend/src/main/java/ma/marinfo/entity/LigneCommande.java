package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ligne_commande")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LigneCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "lignes"})
    private Commande commande;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "article_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Article article;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "quantite_livree", nullable = false)
    private Integer quantiteLivree = 0;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;
}
