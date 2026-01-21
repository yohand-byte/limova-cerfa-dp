const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function testMock() {
  try {
    console.log('Test du remplissage PDF (sans geocoding)...');
    
    const templatePath = path.join(__dirname, 'src/cerfa/templates/cerfa_16702-01.pdf');
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    
    console.log('Template CERFA charge avec succes !');
    console.log('Nombre de pages:', pdfDoc.getPageCount());
    
    try {
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      console.log('Champs du formulaire detectes:', fields.length);
      
      fields.forEach((field, index) => {
        console.log(`  ${index + 1}. ${field.getName()}`);
      });
    } catch (err) {
      console.log('Le PDF n est pas un formulaire interactif');
    }
    
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile('test-cerfa-mock-output.pdf', pdfBytes);
    
    console.log('PDF genere: test-cerfa-mock-output.pdf');
    console.log('Test reussi !');
    
  } catch (error) {
    console.error('Erreur:', error.message);
    console.error(error.stack);
  }
}

testMock();
