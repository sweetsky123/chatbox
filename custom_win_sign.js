/**
 * Windows code signing hook referenced by electron-builder.yml.
 *
 * The upstream script signs installers through AzureSignTool with secrets
 * from Azure Key Vault. This fork has no signing secrets, so packaging stays
 * unsigned — matching the upstream alpha channel behavior. Electron-builder
 * calls this hook for every Windows artifact; doing nothing keeps the build
 * unsigned without failing the packaging step.
 */
module.exports = async function sign(configuration) {
  console.log(`Skipping Windows code signing for ${configuration.path} (fork build, unsigned).`)
}
