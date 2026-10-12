# Site vitrine – Souha Abou Hable, physiothérapeute

Site one-page statique (HTML/CSS/JS, sans étape de build) avec une scène 3D Three.js.

```
index.html        Page unique, SEO (meta, schema.org Physiotherapist, hreflang)
css/style.css     Styles (mobile-first, RTL, prefers-reduced-motion)
js/main.js        Langues FR/EN/AR, navigation, animations, carte, formulaire
js/i18n.js        Traductions EN / AR (le français est dans index.html)
js/scene.js       Scène 3D (colonne vertébrale low-poly, chargée sur desktop uniquement)
assets/           Favicon et visuels statiques de repli (mobile / reduced-motion)
robots.txt, sitemap.xml
```

## Tester en local

Les modules JS ne fonctionnent pas en ouvrant le fichier directement (`file://`). Lancer un petit serveur :

```bash
npx http-server -c-1 .
# puis ouvrir http://localhost:8080
```

## Déployer

Copier tout le dossier tel quel sur n'importe quel hébergement statique : Netlify (glisser-déposer le dossier), Vercel, GitHub Pages, Infomaniak, etc. Aucune compilation n'est nécessaire.

## À compléter avant la mise en ligne

1. **Domaine** : remplacer `VOTRE-DOMAINE.ch` dans `index.html`, `robots.txt` et `sitemap.xml`.
2. **Fiche Physioswiss** : les liens pointent pour l'instant vers `https://www.physioswiss.ch/`. Remplacer par l'URL exacte de la fiche de la praticienne (2 liens avec la classe `physioswiss-link` dans `index.html`).
3. **Formulaire de contact** : il passe par [FormSubmit](https://formsubmit.co) (gratuit, sans compte). Au **premier envoi**, FormSubmit envoie un email d'activation à souhabre@gmail.com : il faut cliquer sur le lien pour que les messages suivants arrivent. Si l'envoi échoue, le site propose automatiquement un lien `mailto:`.
4. **Hébergeur** : compléter la rubrique « Hébergement » des mentions légales (dans `index.html` et les versions EN/AR de `js/i18n.js`).
5. **Photo** (facultatif) : remplacer l'avatar neutre (`.avatar` dans `index.html`) par une vraie photo, par exemple `<img src="assets/photo.jpg" alt="Portrait de Souha Abou Hable">`.

## Choix techniques

- **3D** : Three.js 0.160 chargé depuis jsDelivr, géométries instanciées (une centaine de triangles par vertèbre), sans modèle à télécharger. La colonne change de position, d'échelle et d'opacité selon la section ; dans la section maxillo-faciale, les cervicales s'illuminent et une mâchoire stylisée apparaît. Elle suit aussi la souris.
- **Repli statique** : sous 900 px de large, si `prefers-reduced-motion` est actif, ou sans WebGL, Three.js n'est pas chargé et des illustrations SVG le remplacent.
- **Langues** : FR par défaut, EN et AR (RTL) via les boutons ou `?lang=en` / `?lang=ar`. Le choix est mémorisé dans le navigateur.
- **Vie privée** : la carte Google Maps ne se charge qu'après un clic (consentement). Le site n'a ni cookie ni outil de suivi.
- **Accessibilité** : lien d'évitement, navigation au clavier, focus visible, `aria-live` sur le formulaire, contrastes conformes AA.
