package ma.marinfo.service;

import lombok.RequiredArgsConstructor;
import ma.marinfo.dto.CommandeDtos.*;
import ma.marinfo.entity.*;
import ma.marinfo.exception.MetierException;
import ma.marinfo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private final CommandeRepository commandeRepo;
    private final ClientRepository clientRepo;
    private final ArticleRepository articleRepo;
    private final PromotionRepository promoRepo;
    private final PaiementRepository paiementRepo;
    private final LivraisonRepository livraisonRepo;

    @Transactional
    public Commande passerCommande(Long clientId, CreerCommandeRequest req) {

        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new MetierException("Client introuvable"));

        List<LigneCommande> lignes = new ArrayList<>();

        BigDecimal total = BigDecimal.ZERO;

        for (LigneInput in : req.getLignes()) {

            Article a = articleRepo.findById(in.getArticleId())
                    .orElseThrow(() ->
                            new MetierException("Article introuvable"));

            if (a.getStock() < in.getQuantite()) {
                throw new MetierException(
                        "Stock insuffisant pour : " + a.getTitre()
                );
            }

            BigDecimal prix = promoRepo
                    .findActiveByArticleId(a.getId(), LocalDate.now())
                    .map(p ->
                            a.getPrix()
                                    .multiply(
                                            BigDecimal.valueOf(
                                                    100L - p.getPourcentage()
                                            )
                                    )
                                    .divide(
                                            BigDecimal.valueOf(100),
                                            2,
                                            RoundingMode.HALF_UP
                                    )
                    )
                    .orElse(a.getPrix());

            LigneCommande ligne = LigneCommande.builder()
                    .article(a)
                    .quantite(in.getQuantite())
                    .quantiteLivree(0)
                    .prixUnitaire(prix)
                    .build();

            lignes.add(ligne);

            total = total.add(
                    prix.multiply(
                            BigDecimal.valueOf(in.getQuantite())
                    )
            );

            a.setStock(a.getStock() - in.getQuantite());

            articleRepo.save(a);
        }

        Commande cmd = Commande.builder()
                .numero(genererNumero())
                .client(client)
                .dateCommande(LocalDateTime.now())
                .montantTotal(total)
                .etat("VALIDEE")
                .adresseLivraison(req.getAdresseLivraison())
                .villeLivraison(req.getVilleLivraison())
                .accuseRecu(false)
                .build();

        for (LigneCommande ligne : lignes) {
            ligne.setCommande(cmd);
        }

        cmd.setLignes(lignes);

        cmd = commandeRepo.save(cmd);

        Paiement.Methode methode;

        try {

            methode = Paiement.Methode.valueOf(
                    req.getMethodePaiement()
            );

        } catch (Exception e) {

            throw new MetierException(
                    "Méthode de paiement invalide"
            );
        }

        Paiement paiement = Paiement.builder()
                .commande(cmd)
                .montant(total)
                .methode(methode)
                .etat(Paiement.Etat.VALIDE)
                .reference(
                        "TXN-" +
                                UUID.randomUUID()
                                        .toString()
                                        .substring(0, 8)
                                        .toUpperCase()
                )
                .datePaiement(LocalDateTime.now())
                .build();

        paiementRepo.save(paiement);

        Livraison livraison = Livraison.builder()
                .commande(cmd)
                .etat(Livraison.Etat.EN_PREPARATION)
                .partielle(false)
                .build();

        livraisonRepo.save(livraison);

        return cmd;
    }

    public List<Commande> historiqueClient(Long clientId) {

        return commandeRepo
                .findByClientIdOrderByDateCommandeDesc(clientId);
    }

    public Commande detail(Long id) {

        return commandeRepo.findById(id)
                .orElseThrow(() ->
                        new MetierException("Commande introuvable"));
    }

    public List<Commande> listerToutes() {

        return commandeRepo.findAllByOrderByDateCommandeDesc();
    }

    @Transactional
    public Commande changerEtat(Long commandeId, String etat) {

        Commande commande = detail(commandeId);

        commande.setEtat(etat);

        return commandeRepo.save(commande);
    }

    @Transactional
    public Commande livrer(
            Long commandeId,
            LivraisonPartielleRequest req
    ) {

        Commande commande = detail(commandeId);

        Map<Long, Integer> map = new HashMap<>();

        for (LigneLivrable q : req.getQuantitesLivrees()) {

            map.put(
                    q.getLigneCommandeId(),
                    q.getQuantite()
            );
        }

        boolean toutLivre = true;

        for (LigneCommande ligne : commande.getLignes()) {

            Integer q = map.get(ligne.getId());

            if (q == null) {
                q = 0;
            }

            if (q < 0 || q > ligne.getQuantite()) {

                throw new MetierException(
                        "Quantité invalide"
                );
            }

            ligne.setQuantiteLivree(q);

            if (q < ligne.getQuantite()) {

                toutLivre = false;
            }
        }

        commande.setEtat(
                toutLivre
                        ? "LIVREE"
                        : "LIVREE_PARTIELLE"
        );

        Livraison livraison = Livraison.builder()
                .commande(commande)
                .dateEnvoi(LocalDateTime.now())
                .transporteur(req.getTransporteur())
                .numeroSuivi(req.getNumeroSuivi())
                .etat(
                        toutLivre
                                ? Livraison.Etat.LIVREE
                                : Livraison.Etat.EXPEDIEE
                )
                .partielle(!toutLivre)
                .build();

        livraisonRepo.save(livraison);

        return commandeRepo.save(commande);
    }

    @Transactional
    public Commande accuserReception(
            Long commandeId,
            Long clientId
    ) {

        Commande commande = detail(commandeId);

        if (!commande.getClient().getId().equals(clientId)) {

            throw new MetierException(
                    "Cette commande ne vous appartient pas"
            );
        }

        commande.setAccuseRecu(true);

        commande.setDateAccuse(LocalDateTime.now());

        return commandeRepo.save(commande);
    }

    private String genererNumero() {

        return "CMD-" +
                LocalDate.now().getYear() +
                "-" +
                String.format(
                        "%05d",
                        (int) (Math.random() * 99999)
                );
    }
}