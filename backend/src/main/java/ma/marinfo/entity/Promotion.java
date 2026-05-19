package ma.marinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "promotion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Article article;

    @Column(nullable = false)
    private Integer pourcentage;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    private String libelle;

    /** Vrai si la promotion couvre aujourd'hui. */
    public boolean estActive() {
        LocalDate now = LocalDate.now();
        return !now.isBefore(dateDebut) && !now.isAfter(dateFin);
    }
}
