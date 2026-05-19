package ma.marinfo.service;

import lombok.RequiredArgsConstructor;
import ma.marinfo.entity.Article;
import ma.marinfo.entity.Categorie;
import ma.marinfo.entity.Genre;
import ma.marinfo.exception.MetierException;
import ma.marinfo.repository.ArticleRepository;
import ma.marinfo.repository.CategorieRepository;
import ma.marinfo.repository.GenreRepository;
import ma.marinfo.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepo;
    private final PromotionRepository promoRepo;
    private final CategorieRepository categorieRepo;
    private final GenreRepository genreRepo;

    public List<Map<String, Object>> lister(Long categorieId, Long genreId, String q) {
        List<Article> articles;
        if (q != null && !q.isBlank()) articles = articleRepo.rechercher(q);
        else if (categorieId != null && genreId != null) articles = articleRepo.findByCategorieIdAndGenreIdAndActifTrue(categorieId, genreId);
        else if (categorieId != null) articles = articleRepo.findByCategorieIdAndActifTrue(categorieId);
        else articles = articleRepo.findByActifTrue();

        return articles.stream().map(this::enrichir).toList();
    }

    public Map<String, Object> trouver(Long id) {
        Article a = articleRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Article introuvable"));
        return enrichir(a);
    }

    @Transactional
    public Article creer(Article a) {
        normaliserEtValider(a);
        a.setDateAjout(LocalDateTime.now());
        return articleRepo.save(a);
    }

    @Transactional
    public Article modifier(Long id, Article a) {
        normaliserEtValider(a);
        Article existant = articleRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Article introuvable"));
        existant.setTitre(a.getTitre());
        existant.setAuteur(a.getAuteur());
        existant.setDescription(a.getDescription());
        existant.setPrix(a.getPrix());
        existant.setStock(a.getStock());
        existant.setStockMin(a.getStockMin());
        existant.setImageUrl(a.getImageUrl());
        existant.setAnneeSortie(a.getAnneeSortie());
        existant.setEditeur(a.getEditeur());
        existant.setCategorie(a.getCategorie());
        existant.setGenre(a.getGenre());
        existant.setActif(a.getActif());
        return articleRepo.save(existant);
    }

    @Transactional
    public void supprimer(Long id) {
        Article a = articleRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Article introuvable"));
        a.setActif(false);
        articleRepo.save(a);
    }

    public List<Article> enRupture() { return articleRepo.trouverEnRupture(); }

    private void normaliserEtValider(Article a) {
        if (a == null) throw new MetierException("Article invalide");
        if (a.getTitre() == null || a.getTitre().isBlank()) throw new MetierException("Le titre est obligatoire");
        if (a.getPrix() == null || a.getPrix().compareTo(BigDecimal.ZERO) < 0) throw new MetierException("Le prix est obligatoire");
        if (a.getStock() == null || a.getStock() < 0) a.setStock(0);
        if (a.getStockMin() == null || a.getStockMin() < 0) a.setStockMin(5);
        if (a.getActif() == null) a.setActif(true);

        if (a.getCategorie() == null || a.getCategorie().getId() == null) {
            throw new MetierException("Veuillez sélectionner une catégorie");
        }
        Categorie categorie = categorieRepo.findById(a.getCategorie().getId())
                .orElseThrow(() -> new MetierException("Catégorie introuvable"));
        a.setCategorie(categorie);

        if (a.getGenre() != null && a.getGenre().getId() != null) {
            Genre genre = genreRepo.findById(a.getGenre().getId())
                    .orElseThrow(() -> new MetierException("Genre introuvable"));
            if (genre.getCategorie() != null && !genre.getCategorie().getId().equals(categorie.getId())) {
                throw new MetierException("Le genre ne correspond pas à la catégorie sélectionnée");
            }
            a.setGenre(genre);
        } else {
            a.setGenre(null);
        }
    }

    private Map<String, Object> enrichir(Article a) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", a.getId());
        m.put("titre", a.getTitre());
        m.put("auteur", a.getAuteur());
        m.put("description", a.getDescription());
        m.put("prix", a.getPrix());
        m.put("stock", a.getStock());
        m.put("stockMin", a.getStockMin());
        m.put("imageUrl", a.getImageUrl());
        m.put("anneeSortie", a.getAnneeSortie());
        m.put("editeur", a.getEditeur());
        m.put("categorie", a.getCategorie());
        m.put("genre", a.getGenre());
        m.put("actif", a.getActif());
        m.put("enRupture", a.enRupture());

        promoRepo.findActiveByArticleId(a.getId(), LocalDate.now()).ifPresent(p -> {
            BigDecimal prixFinal = a.getPrix()
                    .multiply(BigDecimal.valueOf(100L - p.getPourcentage()))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            m.put("prixFinal", prixFinal);
            m.put("promotion", Map.of(
                    "pourcentage", p.getPourcentage(),
                    "libelle", p.getLibelle()
            ));
        });
        if (!m.containsKey("prixFinal")) m.put("prixFinal", a.getPrix());
        return m;
    }
}
