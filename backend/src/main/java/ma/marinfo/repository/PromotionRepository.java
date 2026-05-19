package ma.marinfo.repository;

import ma.marinfo.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE p.article.id = :articleId AND :today BETWEEN p.dateDebut AND p.dateFin")
    Optional<Promotion> findActiveByArticleId(Long articleId, LocalDate today);

    @Query("SELECT p FROM Promotion p WHERE :today BETWEEN p.dateDebut AND p.dateFin")
    List<Promotion> findAllActives(LocalDate today);
}
