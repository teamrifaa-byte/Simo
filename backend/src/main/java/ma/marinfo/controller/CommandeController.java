package ma.marinfo.controller;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.marinfo.dto.CommandeDtos.CreerCommandeRequest;
import ma.marinfo.entity.Commande;
import ma.marinfo.entity.LigneCommande;
import ma.marinfo.exception.MetierException;
import ma.marinfo.security.JwtUtil;
import ma.marinfo.service.CommandeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
public class CommandeController {

    private final CommandeService service;
    private final JwtUtil jwt;

    @PostMapping
    public ResponseEntity<?> passer(@Valid @RequestBody CreerCommandeRequest req,
                                    HttpServletRequest http) {
        Long clientId = extraireClientId(http);
        Commande commande = service.passerCommande(clientId, req);
        return ResponseEntity.ok(toResponse(commande));
    }

    @GetMapping("/mes-commandes")
    public ResponseEntity<?> mesCommandes(HttpServletRequest http) {
        Long clientId = extraireClientId(http);

        List<CommandeResponse> commandes = service.historiqueClient(clientId)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(commandes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id) {
        Commande commande = service.detail(id);
        return ResponseEntity.ok(toResponse(commande));
    }

    @PostMapping("/{id}/accuse-reception")
    public ResponseEntity<?> accuser(@PathVariable Long id,
                                     HttpServletRequest http) {
        Commande commande = service.accuserReception(id, extraireClientId(http));
        return ResponseEntity.ok(toResponse(commande));
    }

    private Long extraireClientId(HttpServletRequest req) {
        String h = req.getHeader("Authorization");

        if (h == null || !h.startsWith("Bearer ")) {
            throw new MetierException("Authentification requise");
        }

        Claims c = jwt.extraire(h.substring(7));
        return c.get("userId", Number.class).longValue();
    }

    private CommandeResponse toResponse(Commande commande) {
        List<LigneCommandeResponse> lignes = commande.getLignes() == null
                ? List.of()
                : commande.getLignes()
                .stream()
                .map(this::toLigneResponse)
                .toList();

        String clientNom = commande.getClient() != null
                ? commande.getClient().getNom()
                : "Client";

        return new CommandeResponse(
                commande.getId(),
                clientNom,
                commande.getDateCommande(),
                commande.getEtat(),
                commande.getMontantTotal(),
                lignes
        );
    }

    private LigneCommandeResponse toLigneResponse(LigneCommande ligne) {
        String titre = ligne.getArticle() != null
                ? ligne.getArticle().getTitre()
                : "Produit";

        return new LigneCommandeResponse(
                titre,
                ligne.getQuantite(),
                ligne.getPrixUnitaire()
        );
    }

    public record CommandeResponse(
            Long id,
            String clientNom,
            Object dateCommande,
            Object etat,
            Object montantTotal,
            List<LigneCommandeResponse> lignes
    ) {}

    public record LigneCommandeResponse(
            String titre,
            Integer quantite,
            Object prix
    ) {}
}