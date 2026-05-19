package ma.marinfo.repository;

import ma.marinfo.entity.Reapprovisionnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReapprovisionnementRepository extends JpaRepository<Reapprovisionnement, Long> {
    List<Reapprovisionnement> findByEtatOrderByDateDemandeDesc(Reapprovisionnement.Etat etat);
    List<Reapprovisionnement> findAllByOrderByDateDemandeDesc();
}
