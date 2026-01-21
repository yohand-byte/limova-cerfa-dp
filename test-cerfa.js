const { CERFAGenerator } = require('./src/index');
const fs = require('fs').promises;

const GOOGLE_API_KEY = 'AIzaSyBzJcyMPtHONndrh5EalTIH2ToD_nwBjMQ';

const project = {
  beneficiary: {
    firstName: 'Helene',
    lastName: 'Dupuy',
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
    street: '10 Rue de l Industrie',
    postalCode: '75001',
    city: 'Paris',
    country: 'FR'
  }
};

async function test() {
  try {
    console.log('Test du generateur CERFA...');
    const generator = new CERFAGenerator(GOOGLE_API_KEY);
    console.log('Generation pour:', project.beneficiary.lastName);
    const result = await generator.generateCERFA(project, installer);
    await fs.writeFile('test-cerfa-output.pdf', result.pdfBuffer);
    console.log('CERFA genere avec succes !');
    console.log('Fichier: test-cerfa-output.pdf');
    console.log('Parcelle:', result.parcelle.section, result.parcelle.numero);
    console.log('Superficie:', result.parcelle.superficie, 'm2');
    console.log('Commune:', result.parcelle.commune);
  } catch (error) {
    console.error('Erreur:', error.message);
    console.error(error.stack);
  }
}

test();