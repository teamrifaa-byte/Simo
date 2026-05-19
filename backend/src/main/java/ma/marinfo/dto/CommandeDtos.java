package ma.marinfo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

/** DTOs liés aux commandes et au paiement simulé. */
public class CommandeDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LigneInput {
        @NotNull
        private Long articleId;
        @NotNull @Min(1)
        private Integer quantite;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CreerCommandeRequest {
        @NotEmpty
        private List<LigneInput> lignes;
        @NotBlank
        private String adresseLivraison;
        @NotBlank
        private String villeLivraison;
        @NotNull
        private String methodePaiement;   // CARTE_BANCAIRE / VIREMENT / PAIEMENT_LIVRAISON
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LivraisonPartielleRequest {
        /** Map article_id → quantité livrée */
        @NotEmpty
        private List<LigneLivrable> quantitesLivrees;
        private String transporteur;
        private String numeroSuivi;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LigneLivrable {
        private Long ligneCommandeId;
        private Integer quantite;
    }
}
