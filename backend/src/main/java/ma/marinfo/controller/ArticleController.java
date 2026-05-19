package ma.marinfo.controller;

import lombok.RequiredArgsConstructor;
import ma.marinfo.service.ArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Endpoints publics du catalogue (lecture seule). */
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService service;

    @GetMapping
    public List<Map<String, Object>> lister(
            @RequestParam(required = false) Long categorieId,
            @RequestParam(required = false) Long genreId,
            @RequestParam(required = false) String q) {
        return service.lister(categorieId, genreId, q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> trouver(@PathVariable Long id) {
        return ResponseEntity.ok(service.trouver(id));
    }
}
