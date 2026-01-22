# 🏗️ Limova CERFA & DP Generator

Générateur automatique de **CERFA 16702-01** (Déclaration Préalable) et **Dossier DP Mairie** pour installations photovoltaïques.

✅ **100% GRATUIT - Utilise uniquement les APIs du gouvernement français**

## ✨ Fonctionnalités

### 📄 CERFA 16702-01
- ✅ Remplissage automatique du formulaire
- ✅ Géolocalisation automatique via **API Adresse (gratuite)**
- ✅ Données cadastrales via **Géoportail (gratuit)**
- ✅ Support multi-installateurs (données variables)
- ✅ Signature électronique pré-intégrée
- ✅ Génération des annexes (DP1-DP8)
  - **DP1** : Plan de situation (IGN Géoportail)
  - **DP2** : Plan de masse (Cadastre)
  - **DP5-DP8** : Plans cadastraux

### 🏛️ Dossier DP Mairie
- ✅ Génération complète du dossier
- ✅ Plans automatiques (IGN WMS gratuit)
- ✅ Export PDF prêt à déposer

## 🚀 Installation

```bash
npm install
```

## 📦 Utilisation

```javascript
const { CERFAGenerator } = require('./src/index');

// Plus besoin de clé API !
const generator = new CERFAGenerator();

const result = await generator.generateCERFA(project, installer, signatureBuffer);
```

### Exemple complet

```javascript
const { CERFAGenerator } = require('./src/index');

const project = {
  reference: 'PROJ-2026-001',
  beneficiary: {
    lastName: 'Dupont',
    firstName: 'Jean',
    address: {
      street: '15 rue de la République',
      postalCode: '75001',
      city: 'Paris'
    }
  },
  installation: {
    powerKwc: 9
  },
  description: 'Installation de panneaux photovoltaïques sur toiture'
};

const installer = {
  company: 'SolarTech',
  legalName: 'SolarTech SAS',
  siret: '12345678900012',
  companyType: 'SAS',
  contact: {
    lastName: 'Martin',
    firstName: 'Sophie',
    email: 'contact@solartech.fr',
    phone: '0123456789'
  },
  address: {
    street: '10 avenue des Énergies',
    postalCode: '69001',
    city: 'Lyon'
  }
};

const generator = new CERFAGenerator();
const result = await generator.generateCERFA(project, installer);

// result.pdfBuffer : Buffer du PDF généré
// result.parcelle : Informations cadastrales
```

## 🌍 APIs Utilisées (100% Gratuites)

- ✅ **[API Adresse](https://adresse.data.gouv.fr/)** : Géocodage d'adresses (gouvernement français)
- ✅ **[API Cadastre](https://apicarto.ign.fr/api/doc/cadastre)** : Données cadastrales (IGN)
- ✅ **[Géoportail](https://www.geoportail.gouv.fr/)** : Cartes et plans (IGN)

**Aucune clé API requise !** 🎉

## 🛠️ Technologies

- **pdf-lib** : Manipulation PDF
- **node-fetch** : Requêtes HTTP

## 📚 Documentation

- [API Adresse Data Gouv](https://adresse.data.gouv.fr/api-doc/adresse)
- [API Cadastre IGN](https://apicarto.ign.fr/api/doc/cadastre)
- [pdf-lib Documentation](https://pdf-lib.js.org/)

## 🔄 Changelog

### Version 2.0.0 (Janvier 2026)
- ✅ Suppression de la dépendance Google Maps API
- ✅ Utilisation exclusive des APIs françaises gratuites
- ✅ Plus besoin de clé API
- ✅ Coût : 0€

### Version 1.0.0
- Première version avec Google Maps API

## 📄 Licence

MIT © 2026 Limova - YoyoDev

---

**Développé avec ❤️ par [YoyoDev](https://github.com/yohand-byte)**
