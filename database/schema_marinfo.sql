-- =============================================================
--  Base de données MARINFO - Application e-commerce
--  SGBD : MySQL 8.0+
--  Auteur : Chadi - FST Fès
-- =============================================================

DROP DATABASE IF EXISTS marinfo;
CREATE DATABASE marinfo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marinfo;

-- -------------------------------------------------------------
-- TABLE : categorie  (Livre / CD / DVD)
-- -------------------------------------------------------------
CREATE TABLE categorie (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    libelle     VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    icone       VARCHAR(50)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : genre  (Roman, Pop, Action, ...)
-- -------------------------------------------------------------
CREATE TABLE genre (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    libelle      VARCHAR(50) NOT NULL,
    categorie_id BIGINT NOT NULL,
    CONSTRAINT fk_genre_cat FOREIGN KEY (categorie_id) REFERENCES categorie(id),
    UNIQUE KEY uk_genre (libelle, categorie_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : client
-- -------------------------------------------------------------
CREATE TABLE client (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(80)  NOT NULL,
    prenom        VARCHAR(80)  NOT NULL,
    email         VARCHAR(120) NOT NULL UNIQUE,
    mot_de_passe  VARCHAR(255) NOT NULL,
    telephone     VARCHAR(20),
    adresse       VARCHAR(255),
    ville         VARCHAR(80),
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    actif         BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : administrateur
-- -------------------------------------------------------------
CREATE TABLE administrateur (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom          VARCHAR(80)  NOT NULL,
    email        VARCHAR(120) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role         VARCHAR(30)  NOT NULL DEFAULT 'ADMIN'
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : article
-- -------------------------------------------------------------
CREATE TABLE article (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre           VARCHAR(150) NOT NULL,
    auteur          VARCHAR(120),                -- auteur / artiste / réalisateur
    description     TEXT,
    prix            DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    stock           INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_min       INT NOT NULL DEFAULT 5,
    image_url       VARCHAR(255),
    annee_sortie    INT,
    editeur         VARCHAR(120),
    categorie_id    BIGINT NOT NULL,
    genre_id        BIGINT,
    date_ajout      DATETIME DEFAULT CURRENT_TIMESTAMP,
    actif           BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_article_cat   FOREIGN KEY (categorie_id) REFERENCES categorie(id),
    CONSTRAINT fk_article_genre FOREIGN KEY (genre_id)     REFERENCES genre(id)
) ENGINE=InnoDB;

CREATE INDEX idx_article_titre   ON article(titre);
CREATE INDEX idx_article_cat     ON article(categorie_id);
CREATE INDEX idx_article_stock   ON article(stock);

-- -------------------------------------------------------------
-- TABLE : promotion (hebdomadaire)
-- -------------------------------------------------------------
CREATE TABLE promotion (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id    BIGINT NOT NULL,
    pourcentage   INT NOT NULL CHECK (pourcentage BETWEEN 1 AND 90),
    date_debut    DATE NOT NULL,
    date_fin      DATE NOT NULL,
    libelle       VARCHAR(120),
    CONSTRAINT fk_promo_article FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : commande
-- -------------------------------------------------------------
CREATE TABLE commande (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero        VARCHAR(20) NOT NULL UNIQUE,
    client_id     BIGINT NOT NULL,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    montant_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    etat          VARCHAR(30) NOT NULL DEFAULT 'EN_ATTENTE',
    adresse_livraison VARCHAR(255),
    ville_livraison   VARCHAR(80),
    accuse_recu   BOOLEAN DEFAULT FALSE,
    date_accuse   DATETIME,
    CONSTRAINT fk_cmd_client FOREIGN KEY (client_id) REFERENCES client(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : ligne_commande
-- -------------------------------------------------------------
CREATE TABLE ligne_commande (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    commande_id     BIGINT NOT NULL,
    article_id      BIGINT NOT NULL,
    quantite        INT NOT NULL CHECK (quantite > 0),
    quantite_livree INT NOT NULL DEFAULT 0,
    prix_unitaire   DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_lc_cmd     FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    CONSTRAINT fk_lc_article FOREIGN KEY (article_id)  REFERENCES article(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : paiement (simulé)
-- -------------------------------------------------------------
CREATE TABLE paiement (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    commande_id     BIGINT NOT NULL UNIQUE,
    montant         DECIMAL(10,2) NOT NULL,
    methode         VARCHAR(30) NOT NULL,    -- CARTE_BANCAIRE / VIREMENT / PAIEMENT_LIVRAISON
    etat            VARCHAR(20) DEFAULT 'VALIDE',
    date_paiement   DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference       VARCHAR(60),
    CONSTRAINT fk_pay_cmd FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : livraison
-- -------------------------------------------------------------
CREATE TABLE livraison (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    commande_id     BIGINT NOT NULL,
    date_envoi      DATETIME,
    date_reception  DATETIME,
    transporteur    VARCHAR(80),
    numero_suivi    VARCHAR(60),
    etat            VARCHAR(20) DEFAULT 'EN_PREPARATION',  -- EN_PREPARATION / EXPEDIEE / LIVREE
    partielle       BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_liv_cmd FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLE : reapprovisionnement
-- -------------------------------------------------------------
CREATE TABLE reapprovisionnement (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id      BIGINT NOT NULL,
    quantite        INT NOT NULL CHECK (quantite > 0),
    date_demande    DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_reception  DATETIME,
    etat            VARCHAR(20) DEFAULT 'EN_ATTENTE',     -- EN_ATTENTE / RECU / ANNULE
    fournisseur     VARCHAR(120),
    CONSTRAINT fk_reappro_article FOREIGN KEY (article_id) REFERENCES article(id)
) ENGINE=InnoDB;

-- =============================================================
-- TRIGGERS MÉTIER
-- =============================================================

-- Trigger 1 : décrément automatique du stock à l'insertion d'une ligne
DELIMITER //
CREATE TRIGGER trg_decrement_stock
AFTER INSERT ON ligne_commande
FOR EACH ROW
BEGIN
    UPDATE article SET stock = stock - NEW.quantite WHERE id = NEW.article_id;
END//
DELIMITER ;

-- Trigger 2 : génération automatique d'une demande de réappro si stock <= stock_min
DELIMITER //
CREATE TRIGGER trg_alerte_stock
AFTER UPDATE ON article
FOR EACH ROW
BEGIN
    IF NEW.stock <= NEW.stock_min AND OLD.stock > NEW.stock_min THEN
        INSERT INTO reapprovisionnement(article_id, quantite, fournisseur)
        VALUES (NEW.id, GREATEST(NEW.stock_min * 3, 10), 'Fournisseur par défaut');
    END IF;
END//
DELIMITER ;

-- Trigger 3 : recalcul automatique du total de commande
DELIMITER //
CREATE TRIGGER trg_total_commande
AFTER INSERT ON ligne_commande
FOR EACH ROW
BEGIN
    UPDATE commande
    SET montant_total = (
        SELECT IFNULL(SUM(prix_unitaire * quantite), 0)
        FROM ligne_commande WHERE commande_id = NEW.commande_id
    )
    WHERE id = NEW.commande_id;
END//
DELIMITER ;

-- =============================================================
-- VUES UTILES
-- =============================================================
CREATE VIEW v_articles_rupture AS
SELECT a.id, a.titre, a.stock, a.stock_min, c.libelle AS categorie
FROM article a
JOIN categorie c ON a.categorie_id = c.id
WHERE a.stock <= a.stock_min;

CREATE VIEW v_ventes_par_categorie AS
SELECT c.libelle AS categorie,
       COUNT(DISTINCT cmd.id) AS nb_commandes,
       SUM(lc.quantite * lc.prix_unitaire) AS chiffre_affaire
FROM categorie c
JOIN article a       ON a.categorie_id = c.id
JOIN ligne_commande lc ON lc.article_id = a.id
JOIN commande cmd    ON cmd.id = lc.commande_id
WHERE cmd.etat != 'ANNULEE'
GROUP BY c.libelle;

-- =============================================================
-- DONNÉES DE TEST
-- =============================================================

-- Catégories
INSERT INTO categorie (libelle, description, icone) VALUES
('Livre', 'Romans, essais, BD et plus', 'book'),
('CD',    'Albums et compilations',     'disc'),
('DVD',   'Films et séries',            'film');

-- Genres
INSERT INTO genre (libelle, categorie_id) VALUES
('Roman', 1), ('Science-fiction', 1), ('Polar', 1), ('Essai', 1),
('Pop', 2), ('Rock', 2), ('Jazz', 2), ('Classique', 2),
('Action', 3), ('Drame', 3), ('Comédie', 3), ('Science-fiction', 3);

-- NB : les comptes (admin + client de test) sont créés automatiquement au
-- démarrage de l'application par la classe DataInitializer.java
-- Identifiants par défaut :
--   admin@marinfo.ma   / admin123
--   yassine@test.ma    / client123

-- Articles
INSERT INTO article (titre, auteur, description, prix, stock, image_url, annee_sortie, editeur, categorie_id, genre_id) VALUES
('L''Étranger',        'Albert Camus',    'Roman emblématique de l''absurde.',                     85.00, 20, 'https://covers.openlibrary.org/b/isbn/9782070360024-L.jpg', 1942, 'Gallimard', 1, 1),
('Dune',               'Frank Herbert',   'Chef-d''œuvre de la science-fiction.',                  120.00, 15, 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg', 1965, 'Pocket', 1, 2),
('Le Petit Prince',    'Antoine de Saint-Exupéry', 'Conte philosophique intemporel.',             65.00, 30, 'https://covers.openlibrary.org/b/isbn/9782070612758-L.jpg', 1943, 'Gallimard', 1, 1),
('Millenium 1',        'Stieg Larsson',   'Polar nordique addictif.',                              95.00, 8,  'https://covers.openlibrary.org/b/isbn/9782742765003-L.jpg', 2005, 'Actes Sud', 1, 3),
('Kind of Blue',       'Miles Davis',     'Album culte du jazz modal.',                            150.00, 12, 'https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg', 1959, 'Columbia', 2, 7),
('Thriller',           'Michael Jackson', 'L''album le plus vendu de tous les temps.',             140.00, 25, 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png', 1982, 'Epic', 2, 5),
('Dark Side of the Moon', 'Pink Floyd',   'Album mythique du rock progressif.',                    160.00, 10, 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', 1973, 'Harvest', 2, 6),
('Inception',          'Christopher Nolan', 'Thriller dans les rêves.',                           110.00, 18, 'https://m.media-amazon.com/images/I/51oDg9aS2tL._AC_.jpg', 2010, 'Warner', 3, 9),
('Le Fabuleux Destin d''Amélie Poulain', 'Jean-Pierre Jeunet', 'Conte parisien.',                  95.00, 4,  'https://m.media-amazon.com/images/I/51v8b5UTbBL._AC_.jpg', 2001, 'UGC', 3, 10),
('Interstellar',       'Christopher Nolan', 'Odyssée spatiale et émotionnelle.',                  115.00, 14, 'https://m.media-amazon.com/images/I/71n58xtA9-L._AC_SL1024_.jpg', 2014, 'Paramount', 3, 12);

-- Promotion en cours
INSERT INTO promotion (article_id, pourcentage, date_debut, date_fin, libelle) VALUES
(2, 15, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Promo SF de la semaine'),
(6, 20, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Pop classique -20%');

-- Commande de démo : créée par DataInitializer après l'initialisation des comptes

SELECT '=== Base MARINFO créée avec succès ===' AS message;
SELECT COUNT(*) AS articles FROM article;
SELECT COUNT(*) AS clients FROM client;
