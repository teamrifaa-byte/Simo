package ma.marinfo.repository;

import ma.marinfo.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByActifTrue();

    List<Article> findByCategorieIdAndActifTrue(Long categorieId);

    List<Article> findByCategorieIdAndGenreIdAndActifTrue(Long categorieId, Long genreId);

    @Query("SELECT a FROM Article a WHERE a.actif = true AND " +
           "(LOWER(a.titre)  LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(a.auteur) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Article> rechercher(String q);

    @Query("SELECT a FROM Article a WHERE a.stock <= a.stockMin")
    List<Article> trouverEnRupture();
}
