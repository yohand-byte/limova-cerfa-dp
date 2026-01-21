const { CERFAGenerator } = require('../src/index');
const fs = require('fs').promises;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'YOUR_API_KEY';

const project = {
  reference: 'DOS-2026-0001',
  beneficiary: {
    firstName: 'Jean',
    lastName: 'Martin',
    address: {
      street: '12 Rue du Soleil',
      postalCode: '33000',
      city: 'Bordeaux'
    }
  },
  installation: {
    powerKwc: 9.0,
    surfaceM2: 50
  },
  signatureUrl: 'https://example.com/signatures/client-signature.png'
};

const installer = {
  company: 'SolarTech Pro',
  legalName: 'SolarTech Pro SARL',
  siret: '98765432100015',
  contact: {
    firstName: 'Pierre',
    lastName: 'Dupont',
    email: 'contact@solartech.fr',
    phone: '0623456789'
  },
  address: {
    street: '25 Avenue de l\'Énergie',
    postalCode: '33000',
    city: 'Bordeaux',
    country: 'FR'
  }
};

async function main() {
  try {
    console.log('🚀 Génération CERFA avec signature...');
    
    // Charger la signature (PNG)
    let signatureBuffer = null;
    try {
      signatureBuffer = await fs.readFile('./signature.png');
      console.log('✅ Signature chargée');
    } catch (err) {
      console.log('⚠️ Pas de signature trouvée (signature.png)');
    }
    
    const generator = new CERFAGenerator(GOOGLE_API_KEY);
    const result = await generator.generateCERFA(project, installer, signatureBuffer);
    
    const outputPath = `cerfa_signed_${Date.now()}.pdf`;
    await fs.writeFile(outputPath, result.pdfBuffer);
    
    console.log('');
    console.log('✅ CERFA avec signature généré !');
    console.log('📁 Fichier:', outputPath);
    console.log('📍 Parcelle:', result.parcelle.section, result.parcelle.numero);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };