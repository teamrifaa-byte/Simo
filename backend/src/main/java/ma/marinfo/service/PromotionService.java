package ma.marinfo.service;

import lombok.RequiredArgsConstructor;
import ma.marinfo.entity.Promotion;
import ma.marinfo.exception.MetierException;
import ma.marinfo.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository repo;

    public List<Promotion> toutes()  { return repo.findAll(); }
    public List<Promotion> actives() { return repo.findAllActives(LocalDate.now()); }

    @Transactional
    public Promotion creer(Promotion p) {
        if (p.getDateDebut().isAfter(p.getDateFin()))
            throw new MetierException("Date de début postérieure à la date de fin");
        if (p.getPourcentage() < 1 || p.getPourcentage() > 90)
            throw new MetierException("Pourcentage doit être entre 1 et 90");
        return repo.save(p);
    }

    @Transactional
    public void supprimer(Long id) { repo.deleteById(id); }
}
