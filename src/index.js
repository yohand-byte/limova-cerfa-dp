const CERFAGenerator = require('./cerfa/cerfaGenerator');

module.exports = {
  CERFAGenerator
};

if (require.main === module) {
  console.log('🏗️ Limova CERFA & DP Generator');
  console.log('📦 Module prêt à être utilisé');
  console.log('✅ Utilise les APIs gratuites du gouvernement français');
  console.log('');
  console.log('Exemple:');
  console.log('const { CERFAGenerator } = require(\'./src/index\');');
  console.log('const generator = new CERFAGenerator();');
  console.log('const result = await generator.generateCERFA(project, installer, signature);');
}
