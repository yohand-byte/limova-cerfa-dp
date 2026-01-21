const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class PDFFiller {
  async fillInteractiveForm(pdfDoc, data) {
    try {
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      
      console.log(`📝 Champs du formulaire détectés: ${fields.length}`);
      
      const fieldMapping = {
        'denomination': data.installer?.company || '',
        'raison_sociale': data.installer?.legalName || '',
        'siret': data.installer?.siret || '',
        'representant_nom': data.installer?.contact?.lastName || '',
        'representant_prenom': data.installer?.contact?.firstName || '',
        'declarant_telephone': data.installer?.contact?.phone || '',
        'declarant_email': data.installer?.contact?.email || '',
        'declarant_adresse_voie': data.installer?.address?.street || '',
        'declarant_code_postal': data.installer?.address?.postalCode || '',
        'declarant_ville': data.installer?.address?.city || '',
        'beneficiaire_nom': data.project?.beneficiary?.lastName || '',
        'beneficiaire_prenom': data.project?.beneficiary?.firstName || '',
        'terrain_adresse_voie': data.project?.beneficiary?.address?.street || '',
        'terrain_code_postal': data.project?.beneficiary?.address?.postalCode || '',
        'terrain_ville': data.project?.beneficiary?.address?.city || '',
        'cadastre_prefixe': data.parcelle?.prefix || '',
        'cadastre_section': data.parcelle?.section || '',
        'cadastre_numero': data.parcelle?.numero || '',
        'cadastre_superficie': data.parcelle?.superficie?.toString() || '',
        'projet_description': 'Installation de panneaux photovoltaïques',
        'projet_puissance': data.project?.installation?.powerKwc?.toString() || ''
      };
      
      for (const [fieldName, value] of Object.entries(fieldMapping)) {
        try {
          const field = form.getTextField(fieldName);
          if (field && value) {
            field.setText(value);
          }
        } catch (err) {
          console.log(`⚠️ Champ "${fieldName}" non trouvé`);
        }
      }
      
      form.flatten();
      return pdfDoc;
    } catch (error) {
      console.error('❌ Erreur fillInteractiveForm:', error);
      throw error;
    }
  }

  async fillByCoordinates(pdfDoc, data) {
    try {
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 10;
      
      const fields = [
        { text: data.installer?.company || '', x: 150, y: 700 },
        { text: data.installer?.siret || '', x: 150, y: 680 },
        { text: data.installer?.contact?.lastName || '', x: 150, y: 660 },
        { text: data.installer?.contact?.firstName || '', x: 300, y: 660 },
        { text: data.project?.beneficiary?.address?.street || '', x: 150, y: 500, page: 1 },
        { text: data.project?.beneficiary?.address?.postalCode || '', x: 150, y: 480, page: 1 },
        { text: data.project?.beneficiary?.address?.city || '', x: 250, y: 480, page: 1 },
        { text: data.parcelle?.section || '', x: 150, y: 450, page: 1 },
        { text: data.parcelle?.numero || '', x: 200, y: 450, page: 1 },
        { text: data.parcelle?.superficie?.toString() || '', x: 300, y: 450, page: 1 }
      ];
      
      for (const field of fields) {
        const page = field.page !== undefined ? pages[field.page] : firstPage;
        page.drawText(field.text, {
          x: field.x,
          y: field.y,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        });
      }
      
      return pdfDoc;
    } catch (error) {
      console.error('❌ Erreur fillByCoordinates:', error);
      throw error;
    }
  }
}

module.exports = PDFFiller;
