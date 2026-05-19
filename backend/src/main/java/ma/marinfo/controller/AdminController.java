package ma.marinfo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.marinfo.dto.CommandeDtos.LivraisonPartielleRequest;
import ma.marinfo.entity.*;
import ma.marinfo.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ArticleService articleService;
    private final CatalogueService catalogueService;
    private final CommandeService commandeService;
    private final PromotionService promotionService;
    private final StockService stockService;

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return stockService.dashboard();
    }

    @PostMapping("/articles")
    public Article creerArticle(@RequestBody Article a) {
        return articleService.creer(a);
    }

    @PutMapping("/articles/{id}")
    public Article modifierArticle(@PathVariable Long id, @RequestBody Article a) {
        return articleService.modifier(id, a);
    }

    @DeleteMapping("/articles/{id}")
    public void supprimerArticle(@PathVariable Long id) {
        articleService.supprimer(id);
    }

    @GetMapping("/articles/rupture")
    public List<Article> ruptures() {
        return articleService.enRupture();
    }

    @PostMapping("/categories")
    public Categorie creerCat(@RequestBody Categorie c) {
        return catalogueService.creerCategorie(c);
    }

    @PutMapping("/categories/{id}")
    public Categorie modifierCat(@PathVariable Long id, @RequestBody Categorie c) {
        return catalogueService.modifierCategorie(id, c);
    }

    @DeleteMapping("/categories/{id}")
    public void supprimerCat(@PathVariable Long id) {
        catalogueService.supprimerCategorie(id);
    }

    @PostMapping("/genres")
    public Genre creerGenre(@RequestBody Genre g) {
        return catalogueService.creerGenre(g);
    }

    @DeleteMapping("/genres/{id}")
    public void supprimerGenre(@PathVariable Long id) {
        catalogueService.supprimerGenre(id);
    }

    @GetMapping("/commandes")
    public List<CommandeResponse> toutesCommandes() {
        return commandeService.listerToutes()
                .stream()
                .map(this::toCommandeResponse)
                .toList();
    }

    @PatchMapping("/commandes/{id}/etat")
    public CommandeResponse changerEtat(@PathVariable Long id, @RequestParam String etat) {
        Commande commande = commandeService.detail(id);
        return toCommandeResponse(commande);
    }

    @PostMapping("/commandes/{id}/livraison")
    public CommandeResponse livrer(@PathVariable Long id,
                                   @Valid @RequestBody LivraisonPartielleRequest req) {
        Commande commande = commandeService.livrer(id, req);
        return toCommandeResponse(commande);
    }

    @GetMapping("/promotions")
    public List<Promotion> promos() {
        return promotionService.toutes();
    }

    @PostMapping("/promotions")
    public Promotion creerPromo(@RequestBody Promotion p) {
        return promotionService.creer(p);
    }

    @DeleteMapping("/promotions/{id}")
    public void supprimerPromo(@PathVariable Long id) {
        promotionService.supprimer(id);
    }

    @GetMapping("/reapprovisionnements")
    public List<Reapprovisionnement> reappros() {
        return stockService.toutes();
    }

    @PostMapping("/reapprovisionnements")
    public Reapprovisionnement demanderReappro(
            @RequestParam Long articleId,
            @RequestParam int quantite,
            @RequestParam(required = false) String fournisseur
    ) {
        return stockService.demander(articleId, quantite, fournisseur);
    }

    @PostMapping("/reapprovisionnements/{id}/receptionner")
    public Reapprovisionnement receptionner(@PathVariable Long id) {
        return stockService.receptionner(id);
    }

    private CommandeResponse toCommandeResponse(Commande commande) {
        String clientNom = "Client";

        if (commande.getClient() != null) {
            String nom = commande.getClient().getNom();
            String prenom = commande.getClient().getPrenom();

            clientNom = ((prenom != null ? prenom : "") + " " + (nom != null ? nom : "")).trim();

            if (clientNom.isEmpty()) {
                clientNom = commande.getClient().getEmail();
            }
        }

        return new CommandeResponse(
                commande.getId(),
                clientNom,
                commande.getDateCommande(),
                commande.getMontantTotal(),
                commande.getEtat()
        );
    }

    public record CommandeResponse(
            Long id,
            String clientNom,
            Object dateCommande,
            Object montantTotal,
            Object etat
    ) {}
}