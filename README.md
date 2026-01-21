# 🏗️ Limova CERFA & DP Generator

Générateur automatique de **CERFA 16702-01** (Déclaration Préalable) et **Dossier DP Mairie** pour installations photovoltaïques.

## ✨ Fonctionnalités

### 📄 CERFA 16702-01
- ✅ Remplissage automatique du formulaire
- ✅ Géolocalisation automatique de la parcelle cadastrale (API Cadastre.gouv.fr)
- ✅ Support multi-installateurs (données variables)
- ✅ Signature électronique pré-intégrée
- ✅ Génération des annexes (DP1-DP8)
  - **DP1** : Plan de situation (IGN)
  - **DP2** : Plan de masse (Cadastre)
  - **DP5-DP8** : Photos Street View HD

### 🏛️ Dossier DP Mairie
- ✅ Génération complète du dossier
- ✅ Plans automatiques (IGN WMS)
- ✅ Photos géolocalisées
- ✅ Export PDF prêt à déposer

## 🚀 Installation

```bash
npm install
```

## 📦 Utilisation

```javascript
const { CERFAGenerator } = require('./src/cerfa/cerfaGenerator');

const generator = new CERFAGenerator(GOOGLE_API_KEY);

const result = await generator.generateCERFA(project, installer, signatureBuffer);
```

## 🔑 Variables d'environnement

```
GOOGLE_API_KEY=your_google_api_key
```

## 📚 Documentation

- [API Cadastre](https://apicarto.ign.fr/api/doc/cadastre)
- [Google Maps API](https://developers.google.com/maps)
- [pdf-lib Documentation](https://pdf-lib.js.org/)

## 🛠️ Technologies

- **pdf-lib** : Manipulation PDF
- **node-fetch** : Requêtes HTTP
- **sharp** : Traitement d'images

## 📄 Licence

MIT © 2026 Limova - YoyoDev
