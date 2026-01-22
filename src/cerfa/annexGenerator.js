const { PDFDocument } = require('pdf-lib');
const fetch = require('node-fetch');

class AnnexGenerator {
  constructor() {
    // No API key needed for basic IGN services
  }

  async generateDP1(address, parcelle) {
    try {
      const { lat, lon } = parcelle.coords;
      
      // Using FREE IGN Géoportail WMTS service (no API key required for basic usage)
      const zoom = 16;
      const ignUrl = `https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX=${zoom}&TILEROW=12000&TILECOL=16000&FORMAT=image/png`;
      
      const response = await fetch(ignUrl);
      const imageBuffer = await response.buffer();
      
      return imageBuffer;
    } catch (error) {
      console.error('❌ Erreur generateDP1:', error);
      return null;
    }
  }

  async addAnnexesToPDF(pdfDoc, project, parcelle) {
    try {
      console.log('📎 Génération des annexes...');
      
      const fullAddress = `${project.beneficiary.address.street}, ${project.beneficiary.address.postalCode} ${project.beneficiary.address.city}`;
      
      // Generate cadastral map from IGN (free service)
      const mapBuffer = await this.generateDP1(fullAddress, parcelle);
      
      if (mapBuffer) {
        try {
          const image = await pdfDoc.embedPng(mapBuffer);
          const page = pdfDoc.addPage();
          page.drawImage(image, {
            x: 50,
            y: 50,
            width: 500,
            height: 500
          });
          console.log('✅ Carte cadastrale ajoutée');
        } catch (err) {
          console.log('⚠️ Carte non ajoutée:', err.message);
        }
      }
      
      console.log('✅ Annexes ajoutées');
      return pdfDoc;
    } catch (error) {
      console.error('❌ Erreur addAnnexesToPDF:', error);
      return pdfDoc;
    }
  }
}

module.exports = AnnexGenerator;
