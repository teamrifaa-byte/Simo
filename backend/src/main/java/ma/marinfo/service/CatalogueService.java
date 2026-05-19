package ma.marinfo.service;

import lombok.RequiredArgsConstructor;
import ma.marinfo.entity.Categorie;
import ma.marinfo.entity.Genre;
import ma.marinfo.repository.CategorieRepository;
import ma.marinfo.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CatalogueService {

    private final CategorieRepository categorieRepo;
    private final GenreRepository genreRepo;

    public List<Categorie> listerCategories()         { return categorieRepo.findAll(); }
    public List<Genre> listerGenres()                 { return genreRepo.findAll(); }
    public List<Genre> genresParCategorie(Long catId) { return genreRepo.findByCategorieId(catId); }

    public Categorie creerCategorie(Categorie c) { return categorieRepo.save(c); }
    public Categorie modifierCategorie(Long id, Categorie c) {
        Categorie ex = categorieRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Catégorie introuvable"));
        ex.setLibelle(c.getLibelle());
        ex.setDescription(c.getDescription());
        ex.setIcone(c.getIcone());
        return categorieRepo.save(ex);
    }
    public void supprimerCategorie(Long id) { categorieRepo.deleteById(id); }

    public Genre creerGenre(Genre g) { return genreRepo.save(g); }
    public void supprimerGenre(Long id) { genreRepo.deleteById(id); }
}
