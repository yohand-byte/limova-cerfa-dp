const { PDFDocument } = require('pdf-lib');
const fetch = require('node-fetch');

class AnnexGenerator {
  constructor(googleApiKey) {
    this.googleApiKey = googleApiKey;
  }

  async generateDP1(address, parcelle) {
    try {
      const { lat, lon } = parcelle.coords;
      
      const ignUrl = `https://wxs.ign.fr/${this.googleApiKey}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX=15&TILEROW=12000&TILECOL=16000&FORMAT=image/png`;
      
      const response = await fetch(ignUrl);
      const imageBuffer = await response.buffer();
      
      return imageBuffer;
    } catch (error) {
      console.error('❌ Erreur generateDP1:', error);
      return null;
    }
  }

  async generateStreetViewPhotos(address) {
    try {
      const photos = [];
      const headings = [0, 90, 180, 270];
      
      for (const heading of headings) {
        const url = `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${encodeURIComponent(address)}&heading=${heading}&pitch=0&key=${this.googleApiKey}`;
        const response = await fetch(url);
        const imageBuffer = await response.buffer();
        photos.push(imageBuffer);
      }
      
      return photos;
    } catch (error) {
      console.error('❌ Erreur generateStreetViewPhotos:', error);
      return [];
    }
  }

  async addAnnexesToPDF(pdfDoc, project, parcelle) {
    try {
      console.log('📎 Génération des annexes...');
      
      const fullAddress = `${project.beneficiary.address.street}, ${project.beneficiary.address.postalCode} ${project.beneficiary.address.city}`;
      
      const photos = await this.generateStreetViewPhotos(fullAddress);
      
      for (const photoBuffer of photos) {
        try {
          const image = await pdfDoc.embedJpg(photoBuffer);
          const page = pdfDoc.addPage();
          page.drawImage(image, {
            x: 50,
            y: 50,
            width: 500,
            height: 500
          });
        } catch (err) {
          console.log('⚠️ Photo non ajoutée:', err.message);
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
