# 📖 Guide d'utilisation

## Installation

```bash
npm install limova-cerfa-dp
```

## Configuration

Créez un fichier `.env` :

```
GOOGLE_API_KEY=votre_cle_api_google
```

## Utilisation basique

### Générer un CERFA

```javascript
const { CERFAGenerator } = require('limova-cerfa-dp');

const generator = new CERFAGenerator(process.env.GOOGLE_API_KEY);

// Données du projet
const project = {
  beneficiary: {
    firstName: 'Jean',
    lastName: 'Dupont',
    address: {
      street: '45 Boulevard de la Plage',
      postalCode: '33120',
      city: 'Arcachon'
    }
  },
  installation: {
    powerKwc: 6.5,
    surfaceM2: 35
  }
};

// Données de l'installateur
const installer = {
  company: 'Energie Plus Qualiwatt',
  legalName: 'Energie Plus Qualiwatt SAS',
  siret: '12345678900012',
  contact: {
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'contact@qualiwatt.com',
    phone: '0612345678'
  },
  address: {
    street: '10 Rue de l'Industrie',
    postalCode: '75001',
    city: 'Paris',
    country: 'FR'
  }
};

// Signature (optionnel)
const signatureBuffer = await fs.readFile('signature.png');

// Générer le CERFA
const result = await generator.generateCERFA(project, installer, signatureBuffer);

// Sauvegarder le PDF
await fs.writeFile('cerfa_generated.pdf', result.pdfBuffer);

console.log('✅ CERFA généré !');
console.log('📍 Parcelle cadastrale:', result.parcelle);
```

## Intégration avec Express

```javascript
const express = require('express');
const { CERFAGenerator } = require('limova-cerfa-dp');

const app = express();
app.use(express.json());

app.post('/api/cerfa/generate', async (req, res) => {
  try {
    const { project, installer } = req.body;
    
    const generator = new CERFAGenerator(process.env.GOOGLE_API_KEY);
    const result = await generator.generateCERFA(project, installer);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cerfa.pdf');
    res.send(result.pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('API démarrée sur le port 3000'));
```

## Données retournées

```javascript
{
  pdfBuffer: Buffer,  // Le PDF généré
  parcelle: {
    prefix: '000',
    section: 'AK',
    numero: '0123',
    superficie: 450,
    commune: 'ARCACHON',
    codeCommune: '33009',
    coords: {
      lat: 44.6537,
      lon: -1.1686,
      formatted: '45 Boulevard de la Plage, 33120 Arcachon, France'
    }
  }
}
```

## Erreurs courantes

### Erreur de géolocalisation

```
Error: Geocoding failed: ZERO_RESULTS
```

**Solution** : Vérifiez que l'adresse est correcte et complète.

### Parcelle cadastrale introuvable

```
Error: Aucune parcelle cadastrale trouvée
```

**Solution** : L'adresse est peut-être trop imprécise ou la parcelle n'existe pas dans la base cadastre.

### Template CERFA manquant

```
Error: ENOENT: no such file or directory
```

**Solution** : Placez le fichier `cerfa_16702-01.pdf` dans `src/cerfa/templates/`
