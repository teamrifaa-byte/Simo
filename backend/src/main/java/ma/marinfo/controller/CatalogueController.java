package ma.marinfo.controller;

import lombok.RequiredArgsConstructor;
import ma.marinfo.entity.Categorie;
import ma.marinfo.entity.Genre;
import ma.marinfo.service.CatalogueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CatalogueController {

    private final CatalogueService service;

    @GetMapping("/api/categories")
    public List<Categorie> categories() { return service.listerCategories(); }

    @GetMapping("/api/genres")
    public List<Genre> genres(@RequestParam(required = false) Long categorieId) {
        return categorieId == null ? service.listerGenres() : service.genresParCategorie(categorieId);
    }
}
