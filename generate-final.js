const { PDFDocument } = require('pdf-lib');
const CadastreAPI = require('./src/cerfa/cadastreAPI');
const fs = require('fs').promises;
const path = require('path');

async function generateCERFA(address, installer) {
  const GOOGLE_API_KEY = 'AIzaSyBzJcyMPtHONndrh5EalTIH2ToD_nwBjMQ';
  const cadastreAPI = new CadastreAPI(GOOGLE_API_KEY);
  const parcelle = await cadastreAPI.getParcelleFromAddress(address);
  const section = parcelle.section.replace(/^0+/, '');
  
  console.log('Parcelle cadastrale:');
  console.log('  Section originale:', parcelle.section, '-> corrigee:', section);
  console.log('  Numero:', parcelle.numero);
  console.log('  Superficie:', parcelle.superficie, 'm2');
  
  const templatePath = path.join(__dirname, 'src/cerfa/templates/cerfa_16702-01.pdf');
  const templateBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  
  const street = address.split(',')[0].trim();
  const cityPostal = address.split(',')[1].trim().split(' ');
  const postalCode = cityPostal[0];
  const city = cityPostal.slice(1).join(' ');
  const streetNum = street.match(/^\d+[A-Z]?/)?[0] || '';
  const streetName = street.replace(/^\d+[A-Z]?\s*/, '');
  const dateStr = new Date().toLocaleDateString('fr-FR').replace(/\//g, '');
  
  const fields = {
    'D2D_denomination': installer.company,
    'D2R_raison': installer.legalName || installer.company,
    'D2S_siret': installer.siret,
    'D2J_type': installer.companyType || 'SASU',
    'D2N_nom': installer.contact.lastName,
    'D2P_prenom': installer.contact.firstName,
    'D3N_numero': installer.address.street.split(' ')[0],
    'D3V_voie': installer.address.street.replace(/^\d+\s*/, ''),
    'D3L_localite': installer.address.city,
    'D3C_code': installer.address.postalCode,
    'D3T_telephone': installer.contact.phone,
    'D5GE1_email': installer.contact.email.split('@')[0],
    'D5GE2_email': installer.contact.email.split('@')[1],
    'T2Q_numero': streetNum,
    'T2V_voie': streetName,
    'T2L_localite': city,
    'T2C_code': postalCode,
    'T2F_prefixe': parcelle.prefix,
    'T2S_section': section,
    'T2N_numero': parcelle.numero,
    'T2T_superficie': parcelle.superficie.toString(),
    'D5T_total': parcelle.superficie.toString(),
    'C2ZD1_description': 'Installation de panneaux photovoltaiques sur toiture',
    'E1L_lieu': installer.address.city,
    'E1D_date': dateStr
  };
  
  const checkboxes = {
    'C2ZB1_existante': true,
    'C2ZI0_agrivoltaique': false,
    'C2ZI1_agrivoltaique': true,
    'D5A_acceptation': true,
    'T3B_CUnc': true,
    'T3S_lotnc': true,
    'T3T_ZACnc': true,
    'T3E_AFUnc': true,
    'T3F_PUPnc': true
  };
  
  let filled = 0;
  for (const [name, value] of Object.entries(fields)) {
    try {
      form.getTextField(name).setText(String(value));
      filled++;
    } catch (err) {}
  }
  
  let checked = 0;
  for (const [name, value] of Object.entries(checkboxes)) {
    try {
      const field = form.getCheckBox(name);
      if (value) {
        field.check();
      } else {
        field.uncheck();
      }
      checked++;
    } catch (err) {}
  }
  
  console.log(filled, 'champs remplis');
  console.log(checked, 'cases cochees');
  
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile('CERFA_FINAL.pdf', pdfBytes);
  console.log('CERFA genere: CERFA_FINAL.pdf');
  
  return { pdfBuffer: Buffer.from(pdfBytes), parcelle };
}

const installer = {
  company: 'ENERGIE PLUS - QUALIWATT',
  legalName: 'ENERGIE PLUS - QUALIWATT',
  siret: '85365536300036',
  companyType: 'SASU',
  contact: {
    firstName: 'Henri',
    lastName: 'BEN EZRA',
    email: 'Courrier@vos-demarches-eco-energy.fr',
    phone: '0184883104'
  },
  address: {
    street: '7 AVENUE NIEL',
    city: 'PARIS',
    postalCode: '75017'
  }
};

const address = '23A rue de kergalio, 22410 PLOURHAN';

generateCERFA(address, installer).catch(console.error);
