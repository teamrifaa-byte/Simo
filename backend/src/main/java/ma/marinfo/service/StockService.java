package ma.marinfo.service;

import lombok.RequiredArgsConstructor;
import ma.marinfo.entity.Article;
import ma.marinfo.entity.Reapprovisionnement;
import ma.marinfo.exception.MetierException;
import ma.marinfo.repository.ArticleRepository;
import ma.marinfo.repository.CommandeRepository;
import ma.marinfo.repository.ReapprovisionnementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StockService {

    private final ReapprovisionnementRepository reappRepo;
    private final ArticleRepository             articleRepo;
    private final CommandeRepository            cmdRepo;

    public List<Reapprovisionnement> toutes()    { return reappRepo.findAllByOrderByDateDemandeDesc(); }
    public List<Reapprovisionnement> enAttente() { return reappRepo.findByEtatOrderByDateDemandeDesc(Reapprovisionnement.Etat.EN_ATTENTE); }

    @Transactional
    public Reapprovisionnement demander(Long articleId, int quantite, String fournisseur) {
        Article a = articleRepo.findById(articleId)
                .orElseThrow(() -> new MetierException("Article introuvable"));
        Reapprovisionnement r = Reapprovisionnement.builder()
                .article(a).quantite(quantite).fournisseur(fournisseur)
                .etat(Reapprovisionnement.Etat.EN_ATTENTE)
                .build();
        return reappRepo.save(r);
    }

    /** Réception physique : on ajoute la quantité au stock et on clôt la demande. */
    @Transactional
    public Reapprovisionnement receptionner(Long reapproId) {
        Reapprovisionnement r = reappRepo.findById(reapproId)
                .orElseThrow(() -> new MetierException("Réappro. introuvable"));
        if (r.getEtat() != Reapprovisionnement.Etat.EN_ATTENTE)
            throw new MetierException("Réappro. déjà traitée");

        Article a = r.getArticle();
        a.setStock(a.getStock() + r.getQuantite());
        articleRepo.save(a);

        r.setEtat(Reapprovisionnement.Etat.RECU);
        r.setDateReception(LocalDateTime.now());
        return reappRepo.save(r);
    }

    /** Statistiques agrégées pour le dashboard admin. */
    public Map<String, Object> dashboard() {
        Map<String, Object> m = new HashMap<>();
        m.put("nbArticles",   articleRepo.count());
        m.put("nbCommandes",  cmdRepo.count());
        m.put("nbRuptures",   articleRepo.trouverEnRupture().size());
        m.put("nbReappros",   reappRepo.findByEtatOrderByDateDemandeDesc(Reapprovisionnement.Etat.EN_ATTENTE).size());
        m.put("articlesEnRupture", articleRepo.trouverEnRupture());
        return m;
    }
}
