package ma.marinfo.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.marinfo.entity.*;
import ma.marinfo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Initialise les données nécessaires au lancement local.
 * L'application utilise H2 en mémoire, donc ces données sont recréées à chaque démarrage.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdministrateurRepository adminRepo;
    private final ClientRepository clientRepo;
    private final CategorieRepository categorieRepo;
    private final GenreRepository genreRepo;
    private final ArticleRepository articleRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        creerComptes();
        creerCatalogueDemo();
    }

    private void creerComptes() {
        if (adminRepo.findByEmail("admin@marinfo.ma").isEmpty()) {
            adminRepo.save(Administrateur.builder()
                    .nom("Admin Principal")
                    .email("admin@marinfo.ma")
                    .motDePasse(encoder.encode("admin123"))
                    .role("ADMIN")
                    .build());
            log.info("Compte admin créé : admin@marinfo.ma / admin123");
        }

        if (clientRepo.findByEmail("yassine@test.ma").isEmpty()) {
            clientRepo.save(Client.builder()
                    .nom("Alami").prenom("Yassine")
                    .email("yassine@test.ma")
                    .motDePasse(encoder.encode("client123"))
                    .telephone("0612345678")
                    .adresse("Av. Hassan II, 12").ville("Fès")
                    .actif(true)
                    .build());
            log.info("Client de test créé : yassine@test.ma / client123");
        }
    }

    private void creerCatalogueDemo() {
        if (categorieRepo.count() > 0) return;

        Categorie livres = categorieRepo.save(Categorie.builder()
                .libelle("Livres")
                .description("Romans, essais, bandes dessinées et livres scolaires")
                .icone("book")
                .build());
        Categorie cd = categorieRepo.save(Categorie.builder()
                .libelle("CD")
                .description("Albums musicaux et compilations")
                .icone("disc")
                .build());
        Categorie dvd = categorieRepo.save(Categorie.builder()
                .libelle("DVD")
                .description("Films, séries et documentaires")
                .icone("film")
                .build());

        Genre roman = genreRepo.save(Genre.builder().libelle("Roman").categorie(livres).build());
        Genre business = genreRepo.save(Genre.builder().libelle("Business").categorie(livres).build());
        Genre pop = genreRepo.save(Genre.builder().libelle("Pop").categorie(cd).build());
        Genre cinema = genreRepo.save(Genre.builder().libelle("Cinéma").categorie(dvd).build());

        articleRepo.save(Article.builder()
                .titre("Le Petit Prince")
                .auteur("Antoine de Saint-Exupéry")
                .description("Un classique poétique et intemporel.")
                .prix(new BigDecimal("79.00"))
                .stock(20)
                .stockMin(5)
                .imageUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600")
                .anneeSortie(1943)
                .editeur("Gallimard")
                .categorie(livres)
                .genre(roman)
                .actif(true)
                .build());

        articleRepo.save(Article.builder()
                .titre("Marketing Digital au Maroc")
                .auteur("MARINFO Editions")
                .description("Guide pratique pour comprendre les bases du marketing digital.")
                .prix(new BigDecimal("149.00"))
                .stock(12)
                .stockMin(4)
                .imageUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600")
                .anneeSortie(2025)
                .editeur("MARINFO")
                .categorie(livres)
                .genre(business)
                .actif(true)
                .build());

        articleRepo.save(Article.builder()
                .titre("Moroccan Pop Collection")
                .auteur("Artistes variés")
                .description("Une sélection musicale moderne.")
                .prix(new BigDecimal("99.00"))
                .stock(15)
                .stockMin(3)
                .imageUrl("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600")
                .anneeSortie(2024)
                .editeur("MARINFO Music")
                .categorie(cd)
                .genre(pop)
                .actif(true)
                .build());

        articleRepo.save(Article.builder()
                .titre("Cinéma Marocain - Collection")
                .auteur("Réalisateurs marocains")
                .description("Sélection de films et documentaires marocains.")
                .prix(new BigDecimal("129.00"))
                .stock(8)
                .stockMin(2)
                .imageUrl("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600")
                .anneeSortie(2023)
                .editeur("MARINFO Vidéo")
                .categorie(dvd)
                .genre(cinema)
                .actif(true)
                .build());

        log.info("Catalogue de démonstration créé : catégories, genres et articles.");
    }
}
