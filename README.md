# 🏗️ Limova CERFA & DP Generator

Générateur automatique de **CERFA 16702-01** (Déclaration Préalable) et **Dossier DP Mairie** pour installations photovoltaïques.

✅ **100% GRATUIT - Utilise uniquement les APIs du gouvernement français**

## ✨ Fonctionnalités

### 📄 CERFA 16702-01
- ✅ Remplissage automatique du formulaire
- ✅ Géolocalisation automatique de la parcelle cadastrale (API Cadastre.gouv.fr)
- ✅ Géocodage d'adresses (API Adresse data.gouv.fr - GRATUIT)
- ✅ Support multi-installateurs (données variables)
- ✅ Signature électronique pré-intégrée
- ✅ Génération des annexes (DP1-DP2)
  - **DP1** : Plan de situation (IGN Géoportail)
  - **DP2** : Plan de masse (Cadastre)

### 🏛️ Dossier DP Mairie
- ✅ Génération complète du dossier
- ✅ Plans automatiques (IGN WMTS gratuit)
- ✅ Export PDF prêt à déposer

## 🚀 Installation

```bash
npm install
```

## 📦 Utilisation

```javascript
const { CERFAGenerator } = require('./src/index');

// Plus besoin de clé API Google !
const generator = new CERFAGenerator();

const result = await generator.generateCERFA(project, installer, signatureBuffer);
```

## 🆓 APIs Gratuites Utilisées

- **API Adresse** (data.gouv.fr) : Géocodage d'adresses
- **API Cadastre** (IGN) : Données cadastrales
- **Géoportail WMTS** (IGN) : Cartes et plans

**Aucune clé API requise !**

## 📚 Documentation

- [API Adresse](https://adresse.data.gouv.fr/api-doc/adresse)
- [API Cadastre](https://apicarto.ign.fr/api/doc/cadastre)
- [IGN Géoportail](https://geoservices.ign.fr/services-web-essentiels)
- [pdf-lib Documentation](https://pdf-lib.js.org/)

## 🛠️ Technologies

- **pdf-lib** : Manipulation PDF
- **node-fetch** : Requêtes HTTP
- **APIs gouvernementales françaises** : Géocodage et cadastre

## 📄 Licence

MIT © 2026 Limova - YoyoDev
