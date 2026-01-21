const { CERFAGenerator } = require('../src/index');
const fs = require('fs').promises;

// Configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'YOUR_API_KEY';

// Exemple de données projet
const project = {
  reference: 'DOS-2026-0001',
  beneficiary: {
    firstName: 'Hélène',
    lastName: 'Dupuy',
    address: {
      street: '45 Boulevard de la Plage',
      postalCode: '33120',
      city: 'Arcachon'
    }
  },
  installation: {
    powerKwc: 6.5,
    surfaceM2: 35,
    panelsCount: 18
  }
};

// Exemple de données installateur
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
    street: '10 Rue de l\'Industrie',
    postalCode: '75001',
    city: 'Paris',
    country: 'FR'
  }
};

async function main() {
  try {
    console.log('🚀 Démarrage de la génération CERFA...');
    console.log('');
    
    // Créer le générateur
    const generator = new CERFAGenerator(GOOGLE_API_KEY);
    
    // Générer le CERFA
    console.log('📄 Génération du CERFA pour:', project.beneficiary.lastName);
    const result = await generator.generateCERFA(project, installer);
    
    // Sauvegarder le PDF
    const outputPath = `cerfa_${project.beneficiary.lastName}_${Date.now()}.pdf`;
    await fs.writeFile(outputPath, result.pdfBuffer);
    
    console.log('');
    console.log('✅ CERFA généré avec succès !');
    console.log('📁 Fichier:', outputPath);
    console.log('');
    console.log('📍 Parcelle cadastrale:');
    console.log('   - Section:', result.parcelle.section);
    console.log('   - Numéro:', result.parcelle.numero);
    console.log('   - Superficie:', result.parcelle.superficie, 'm²');
    console.log('   - Commune:', result.parcelle.commune);
    console.log('');
    console.log('🗺️ Coordonnées GPS:');
    console.log('   - Latitude:', result.parcelle.coords.lat);
    console.log('   - Longitude:', result.parcelle.coords.lon);
    console.log('');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = { main };