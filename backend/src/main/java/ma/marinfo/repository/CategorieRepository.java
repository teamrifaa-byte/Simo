package ma.marinfo.repository;

import ma.marinfo.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    Optional<Categorie> findByLibelle(String libelle);
}
