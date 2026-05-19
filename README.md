# MARINFO — Application e-commerce

> Projet tutoré — Semestre 6 — FST Fès
> Application complète de vente en ligne de livres, CD et DVD.

---

## 🏗️ Architecture

```
MARINFO/
├── backend/        ← API REST Spring Boot (Java 17)
├── frontend/       ← Interface React + Vite + Tailwind
├── database/       ← Script SQL MySQL
└── docs/           ← Documentation
```

**Stack technique**

| Couche      | Technologies |
|-------------|--------------|
| Frontend    | React 18, Vite, Tailwind CSS 3, Framer Motion, react-three-fiber, Axios, React Router 6 |
| Backend     | Spring Boot 3.2, Spring Security, Spring Data JPA, JWT (jjwt 0.12), Lombok |
| BDD         | MySQL 8 |
| Sécurité    | BCrypt (cost 10) + JWT stateless |
| Build       | Maven (backend), Vite (frontend) |

---

## ✅ Prérequis

- **Java 17+** — `java -version`
- **Maven 3.8+** — `mvn -version`
- **Node.js 18+** — `node -v`
- **MySQL 8+** en local (port 3306 par défaut)

---

## 🚀 Lancement étape par étape

### 1️⃣ Base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script (le script crée la base + tables + triggers + données de test)
SOURCE /chemin/vers/MARINFO/database/schema_marinfo.sql;
```

> 💡 Si votre mot de passe MySQL n'est pas `root`, modifiez `backend/src/main/resources/application.properties` :
> ```
> spring.datasource.username=root
> spring.datasource.password=VOTRE_MDP
> ```

### 2️⃣ Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

L'API démarre sur **http://localhost:8080**. Les comptes par défaut sont créés automatiquement :

| Type   | Email              | Mot de passe |
|--------|--------------------|--------------|
| Admin  | `admin@marinfo.ma` | `admin123`   |
| Client | `yassine@test.ma`  | `client123`  |
| Client | `salma@test.ma`    | `client123`  |

Vérifier que l'API répond :
```bash
curl http://localhost:8080/api/articles
```

### 3️⃣ Frontend (React + Vite)

Dans un autre terminal :
```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur **http://localhost:5173**.

---

## 🗺️ Routes principales

### Front-office (clients)
| URL | Description |
|-----|-------------|
| `/` | Accueil avec hero 3D animé |
| `/catalogue` | Liste des articles avec filtres |
| `/catalogue?categorieId=1` | Filtre par catégorie |
| `/article/:id` | Fiche produit |
| `/cart` | Panier |
| `/login` / `/register` | Authentification client |
| `/checkout` | Validation & paiement simulé |
| `/mes-commandes` | Historique |
| `/commande/:id` | Suivi en temps réel |

### Back-office (admin)
| URL | Description |
|-----|-------------|
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard avec KPI |
| `/admin/articles` | CRUD articles |
| `/admin/categories` | Gestion catégories & genres |
| `/admin/commandes` | Suivi commandes + livraison partielle |
| `/admin/promotions` | Promotions hebdomadaires |
| `/admin/reapprovisionnements` | Demandes de réappro |

---

## 🔌 Endpoints API principaux

```
# Authentification (public)
POST /api/auth/register              Inscription client
POST /api/auth/login                 Connexion client
POST /api/auth/admin/login           Connexion administrateur

# Catalogue (public)
GET  /api/articles                   Liste articles (?categorieId, ?genreId, ?q)
GET  /api/articles/{id}              Détail article
GET  /api/categories                 Liste catégories
GET  /api/genres                     Liste genres
GET  /api/promotions/actives         Promotions en cours

# Client (JWT requis)
POST   /api/commandes                Créer une commande
GET    /api/commandes/mes-commandes  Historique
GET    /api/commandes/{id}           Détail commande
POST   /api/commandes/{id}/accuse-reception

# Admin (rôle ADMIN requis)
GET    /api/admin/dashboard
POST   /api/admin/articles
PUT    /api/admin/articles/{id}
DELETE /api/admin/articles/{id}
GET    /api/admin/articles/rupture
GET    /api/admin/commandes
PATCH  /api/admin/commandes/{id}/etat
POST   /api/admin/commandes/{id}/livraison
GET    /api/admin/promotions
POST   /api/admin/promotions
GET    /api/admin/reapprovisionnements
POST   /api/admin/reapprovisionnements/{id}/receptionner
```

---

## 🎓 Pour la soutenance

### Démo en 5 minutes
1. **Accueil** : montrer le hero 3D (livre + CD + DVD qui flottent), animations Framer Motion
2. **Catalogue** : filtrer par catégorie → genre, faire une recherche
3. **Fiche produit** : ajouter au panier d'un article en promo
4. **Panier** : modifier les quantités
5. **Inscription rapide** d'un nouveau client → checkout → paiement simulé
6. **Suivi commande** : montrer la timeline visuelle
7. **Back-office** :
   - Dashboard avec KPI
   - Modifier le stock d'un article (descendre sous le seuil → réappro auto)
   - Traiter une livraison partielle
   - Créer une promotion hebdomadaire

### Points techniques à mettre en avant
- **Architecture 3-tiers** stricte (présentation React / logique Spring / données MySQL)
- **Sécurité** : BCrypt + JWT stateless + filtres Spring Security + CORS configuré
- **Triggers SQL** : décrément stock auto, alerte réappro auto, calcul total
- **Animations 3D** : react-three-fiber + Three.js, optimisations mobile (dpr capped)
- **Suppression logique** des articles plutôt que physique → préservation de l'historique
- **Gestion des promotions** : prix recalculé à la volée par le backend

---

## 🛠️ Dépannage

| Problème | Solution |
|----------|----------|
| `Access denied for user 'root'` | Vérifier `application.properties` |
| `Port 8080 already in use` | `server.port=8081` dans `application.properties` |
| Frontend ne joint pas l'API | Le proxy Vite redirige `/api` → `http://localhost:8080` (cf. `vite.config.js`) |
| Erreur CORS | Vérifier que le frontend tourne sur le port 5173 |
| Comptes par défaut absents | Redémarrer le backend — `DataInitializer` les crée au boot |

---

## 👤 Auteur

**Chadi** — FST Fès — Semestre 6 — 2025/2026
Sous la direction de : *(à compléter)*

---

## 📜 Licence

Projet à usage pédagogique uniquement.
