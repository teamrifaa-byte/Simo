# Notes pour la soutenance

## Architecture en 3 minutes

### Couche présentation (React)
- **Pages** : composants au routage (Home, Catalogue, Cart, Admin/*).
- **Components** : éléments réutilisables (Navbar, ProductCard, Hero3D).
- **Context API** : `AuthContext` (utilisateur connecté) + `CartContext` (panier local).
- **Services** (`api.js`) : axios + intercepteur qui injecte le JWT à chaque requête.

### Couche logique (Spring Boot)
- **Controllers** : exposent l'API REST, valident les DTOs, vérifient les rôles.
- **Services** : portent les règles métier — *toute* l'intelligence est ici.
- **Repositories** : Spring Data JPA — pas une ligne de SQL à écrire pour les CRUD basiques.
- **Security** : `JwtAuthFilter` extrait le token à chaque requête, alimente le `SecurityContext`.

### Couche données (MySQL)
- 11 tables avec contraintes d'intégrité référentielle
- 3 triggers : décrément stock, alerte réappro, calcul total
- 2 vues métier : articles en rupture, CA par catégorie

---

## Flux d'une commande (à expliquer au jury)

1. Client clique "Ajouter au panier" → `CartContext.addItem()` → localStorage
2. Client valide → `POST /api/commandes` avec JWT dans le header
3. `JwtAuthFilter` → décode le token → `SecurityContext`
4. `CommandeController` → délègue au service
5. `CommandeService.passerCommande()` :
   - Vérifie le stock de chaque article (en transaction)
   - Applique les promotions actives
   - Crée la commande + lignes + paiement simulé + livraison
   - Décrémente le stock (le trigger SQL aurait aussi pu le faire)
6. Retourne la commande au frontend → redirection vers `/commande/:id`
7. Le stepper visuel affiche la progression

---

## Pourquoi ces choix techniques ?

| Choix | Alternative | Justification |
|-------|-------------|---------------|
| React + Vite | Angular, plain HTML | Plus populaire, courbe d'apprentissage douce, Vite très rapide |
| Tailwind | Bootstrap | Utility-first → design sur-mesure plutôt que générique |
| Framer Motion | CSS animations | Animations contrôlées en React, beaucoup plus expressives |
| react-three-fiber | Three.js brut | Composants React → beaucoup plus simple à intégrer |
| Spring Boot | Django, Node | Le standard Java enterprise, JPA mature, sécurité éprouvée |
| MySQL | Oracle | Gratuit, plus simple à installer pour un étudiant |
| JWT | Session HTTP | Stateless → scalable, pas de stockage serveur |
| BCrypt | SHA256 | Résiste aux GPU/ASIC, gold standard de l'industrie |

---

## Questions possibles du jury (et réponses)

**Q : Pourquoi du JWT et pas une session classique ?**
R : Le JWT est *stateless*, le serveur n'a rien à mémoriser. C'est essentiel pour scaler horizontalement (plusieurs serveurs derrière un load balancer). Avec une session, il faudrait Redis ou du sticky session.

**Q : Comment garantissez-vous la cohérence du stock ?**
R : Triple sécurité : (1) vérification applicative dans `CommandeService`, (2) transaction `@Transactional` qui rollback en cas d'erreur, (3) trigger SQL qui décrémente côté base — défense en profondeur.

**Q : Pourquoi pas un vrai paiement ?**
R : Intégrer Stripe ou CMI nécessite un compte marchand et des contrats. Pour un projet académique, on simule la transaction tout en respectant l'architecture qu'un vrai paiement utiliserait.

**Q : La 3D n'est-elle pas trop lourde ?**
R : Le hero Three.js fait moins de 100 ko. `dpr={[1, 2]}` cape la résolution sur les écrans haute densité pour les mobiles. `Suspense` permet un fallback pendant le chargement.

**Q : Comment géreriez-vous 1000 utilisateurs simultanés ?**
R : Tomcat embarqué tient 200 threads par défaut → suffisant pour 1000 utilisateurs avec une latence raisonnable. Au-delà : ajouter Redis pour les promotions (cache), pagination des articles, séparer lecture/écriture sur la BDD.
