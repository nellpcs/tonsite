# Tonsite — Système de design unifié

Ce document remplace les 77 écrans de maquette comme référence de design. Les maquettes ont servi à définir la structure et le contenu de chaque écran, mais leur style visuel variait d'un écran à l'autre (généré indépendamment). Ce document tranche toutes les divergences et devient la **seule source de vérité** pour tout prompt futur envoyé à Claude Code.

---

## 1. Identité de marque

| Élément | Valeur |
|---|---|
| Couleur principale | `#8C63FF` (violet-indigo) |
| Couleur secondaire | `#FF6584` (corail/rose) |
| Couleur accent | `#00D084` (vert) |
| Vert WhatsApp | `#25D366` |
| Police | Inter |
| Logo | Icône étoile/fleur à 4 branches en violet + wordmark "Tonsite" en gras |

**Nuances dérivées à ajouter à `tailwind.config.ts`** (résout le problème du texte "success" trop clair qu'on a rencontré) :

primary-50 à primary-900 (échelle complète, pas juste 
#8C63FF)
secondary-50 à secondary-900
accent-50 à accent-900

Utiliser `accent-700` pour le texte sur fond clair, `accent-500` (#00D084) réservé aux éléments décoratifs (icônes, points, sparklines).

---

## 2. Typographie

| Usage | Taille | Poids |
|---|---|---|
| Titre de page (H1) | 24px / 1.5rem | Bold (700) |
| Titre de section (H2) | 18px / 1.125rem | Semibold (600) |
| Corps de texte | 14px / 0.875rem | Regular (400) |
| Texte secondaire/label | 13px / 0.8125rem | Regular, `text-gray-500` |
| Chiffres de stats (StatCard) | 28px / 1.75rem | Bold (700) |
| Boutons | 14px / 0.875rem | Medium (500) |

---

## 3. Espacement, rayons, ombres

| Élément | Règle |
|---|---|
| Rayon des cartes | `rounded-2xl` (16px) — jamais `rounded-lg` ou `rounded-xl` ailleurs, uniformiser partout |
| Rayon des boutons | `rounded-xl` (12px) |
| Rayon des inputs | `rounded-xl` (12px) |
| Rayon des pastilles/badges | `rounded-full` |
| Ombre des cartes | `shadow-sm` uniquement (jamais `shadow-md`/`shadow-lg` — la maquette est plate, pas skeuomorphique) |
| Padding interne carte | `p-4` mobile, `p-6` desktop |
| Espacement entre cartes | `gap-4` |
| Marge de page | `px-4` mobile, `px-6` desktop |

---

## 4. Composants — règles unifiées

### Boutons (déjà codés dans `Button.tsx`)
- `primary` : fond `#8C63FF`, texte blanc — actions principales (Enregistrer, Continuer, Créer ma boutique)
- `whatsapp` : fond `#25D366`, texte blanc, icône WhatsApp inline — uniquement pour les actions WhatsApp
- `outline` : bordure `#8C63FF`, texte `#8C63FF`, fond transparent — actions secondaires
- `ghost` : pas de bordure, texte `#8C63FF` — actions tertiaires (liens, "Voir tout")
- `danger` : fond rouge — uniquement Supprimer

**Règle stricte à appliquer partout** : jamais deux boutons `primary` côte à côte. Un écran a un seul CTA principal ; le reste est `outline` ou `ghost`.

### Badges
- `discount` (fond `#FF6584`, texte blanc) : réductions uniquement (-33%, -20%)
- `success` (fond `accent-50`, texte `accent-700`) : "En ligne", "Terminée", statuts positifs
- `neutral` (fond gris clair, texte gris foncé) : statuts neutres
- `primary` (fond `primary-50`, texte `primary-700`) : "Nouvelle", statuts en attente d'action

### Toggle
Fond `primary` uniquement quand actif. Jamais de vert pour un toggle (réservé aux badges de succès).

### Navigation
- **Desktop vendeur** : sidebar fixe gauche, item actif = `bg-primary/10 text-primary`
- **Mobile vendeur** : bottom nav 5 items avec bouton `+` central surélevé en violet
- **Mobile client** : bottom nav catégories (Accueil, Catégories, Favoris, Panier, Profil) — à ajouter, absent du code actuel, présent dans la maquette écran 7

### Cartes produit (liste)
Image 56×56 en `rounded-xl` `object-cover`, nom en gras, prix en gras + prix barré si promo (`text-gray-400 line-through`), stock en `text-gray-500` (ou rouge si rupture), toggle à droite.

### StatCard
Chiffre en gras 28px, label en `text-gray-500` au-dessus, badge de variation en pastille (`bg-accent/10 text-accent-700` si positif, `bg-red-50 text-red-600` si négatif), sparkline en bas, couleur ligne = `accent-500` (jamais `primary`, pour ne pas confondre avec les éléments interactifs).

---

## 5. États systématiques à prévoir sur CHAQUE écran à données

| État | Quand | Contenu |
|---|---|---|
| **Chargement** | Pendant un fetch serveur | Skeleton (rectangles gris pulsants), jamais de spinner plein écran seul |
| **Vide** | Liste sans résultat (aucun produit, aucune commande, recherche sans résultat) | Icône simple + message clair + CTA si pertinent (ex: "Ajouter un produit") |
| **Erreur** | Échec réseau/serveur | Message clair + bouton "Réessayer", jamais un écran blanc |
| **Succès inline** | Après une action (Enregistrer, Créer) | Toast/bannière temporaire, pas une popup bloquante à fermer manuellement |

---

## 6. Améliorations à ajouter

1. **Accessibilité tactile** : toutes les zones cliquables (boutons, toggles, cartes produit) doivent avoir une hauteur minimale de 44px.
2. **Feedback de copie** : les boutons "Copier le lien" doivent afficher une confirmation visuelle temporaire ("Copié !"), pas juste copier silencieusement.
3. **Confirmation avant action destructive** : "Supprimer" (produit, commande) doit toujours ouvrir une confirmation, jamais une suppression immédiate au premier clic.
4. **Cohérence des montants** : format FCFA unifié partout — `8 000 FCFA` (espace insécable comme séparateur de milliers), jamais `8000` ou `8,000`.
5. **Skeleton plutôt que spinner** pour toute page qui charge des données réelles (dashboard, listes) — perçu comme plus rapide et plus professionnel.
6. **Zone de retour tactile** : le bouton retour (`←`) doit être assez grand et à portée du pouce en usage mobile une main.

---

Une fois le fichier créé, confirme-moi juste son emplacement et son contenu — ne modifie aucun autre fichier du projet dans ce prompt. On décidera ensemble ensuite des corrections à appliquer.
