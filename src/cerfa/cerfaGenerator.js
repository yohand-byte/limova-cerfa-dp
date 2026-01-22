const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const CadastreAPI = require('./cadastreAPI');
const PDFFiller = require('./pdfFiller');
const AnnexGenerator = require('./annexGenerator');

class CERFAGenerator {
  constructor() {
    // No API key needed - using free French government APIs
    this.cadastreAPI = new CadastreAPI();
    this.pdfFiller = new PDFFiller();
    this.annexGenerator = new AnnexGenerator();
    this.templatePath = path.join(__dirname, 'templates', 'cerfa_16702-01.pdf');
  }

  async generateCERFA(project, installer, signatureBuffer = null) {
    try {
      console.log('🚀 Génération CERFA pour:', project.beneficiary.lastName);
      
      const templateBytes = await fs.readFile(this.templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);
      
      const fullAddress = `${project.beneficiary.address.street}, ${project.beneficiary.address.postalCode} ${project.beneficiary.address.city}`;
      const parcelle = await this.cadastreAPI.getParcelleFromAddress(fullAddress);
      
      const data = {
        installer: installer,
        project: project,
        parcelle: parcelle
      };
      
      try {
        await this.pdfFiller.fillInteractiveForm(pdfDoc, data);
        console.log('✅ Formulaire interactif rempli');
      } catch (error) {
        console.log('⚠️ Formulaire non-interactif, utilisation coordonnées XY');
        await this.pdfFiller.fillByCoordinates(pdfDoc, data);
      }
      
      if (signatureBuffer) {
        await this.addSignature(pdfDoc, signatureBuffer);
      }
      
      await this.annexGenerator.addAnnexesToPDF(pdfDoc, project, parcelle);
      
      const pdfBytes = await pdfDoc.save();
      console.log('✅ CERFA généré avec succès');
      
      return {
        pdfBuffer: Buffer.from(pdfBytes),
        parcelle: parcelle
      };
    } catch (error) {
      console.error('❌ Erreur generateCERFA:', error);
      throw error;
    }
  }

  async addSignature(pdfDoc, signatureBuffer) {
    try {
      const signatureImage = await pdfDoc.embedPng(signatureBuffer);
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      
      lastPage.drawImage(signatureImage, {
        x: 400,
        y: 100,
        width: 150,
        height: 50
      });
      
      console.log('✅ Signature ajoutée');
    } catch (error) {
      console.error('❌ Erreur addSignature:', error);
    }
  }
}

module.exports = CERFAGenerator;
