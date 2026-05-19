package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "article")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titre;

    @Column(length = 120)
    private String auteur;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "stock_min", nullable = false)
    private Integer stockMin = 5;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "annee_sortie")
    private Integer anneeSortie;

    private String editeur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Categorie categorie;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "genre_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Genre genre;

    @Column(name = "date_ajout")
    private LocalDateTime dateAjout = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean actif = true;

    /** Vrai si stock atteint ou inférieur au seuil minimum. */
    public boolean enRupture() { return stock != null && stock <= stockMin; }
}
