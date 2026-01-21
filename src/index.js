const CERFAGenerator = require('./cerfa/cerfaGenerator');

// Export pour utilisation dans d'autres projets
module.exports = {
  CERFAGenerator
};

// Exemple d'utilisation
if (require.main === module) {
  console.log('🏗️ Limova CERFA & DP Generator');
  console.log('📦 Module prêt à être utilisé');
  console.log('');
  console.log('Exemple d\'utilisation:');
  console.log('');
  console.log('const { CERFAGenerator } = require(\'./src/index\');');
  console.log('const generator = new CERFAGenerator(GOOGLE_API_KEY);');
  console.log('const result = await generator.generateCERFA(project, installer, signature);');
}
