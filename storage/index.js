const azure_nextgen =  require("@pulumi/azure-nextgen");
const azure =  require("@pulumi/azure");
const config = require('./config/main');
const {createStorageAccount} = require('./modules/storage/storageAccount');
const {createKeyVault} = require('./modules/keyvault/vault');
const {createRSV} = require('./modules/recoveryservices/vault');


async function createResources()  {


//
const azureProviderOld = await  new azure.Provider('azure_old',{
   clientId: config.applicationId,
   clientSecret: config.password,
   tenantId: config.tenant,
   subscriptionId: config.subscription
}); 

//Create Provider using Service Principal
const azureProvider = await new azure_nextgen.Provider('azure',{
   clientId: config.applicationId,
   clientSecret: config.password,
   tenantId: config.tenant,
   subscriptionId: config.subscription
});

//Get Resource Grpup Environment
const resourceGroup = await  azure_nextgen.resources.latest.getResourceGroup({resourceGroupName: `rg-${config.environment}-${config.location}-001`},{provider:azureProvider});    

//Get Log Workspace
const workspace = await azure_nextgen.operationalinsights.v20200801.getWorkspace({resourceGroupName: resourceGroup.name,workspaceName:`logw-${config.environment}-default-001`},{provider:azureProvider});

//Get Subnet
const subnet = await azure_nextgen.network.latest.getSubnet({resourceGroupName: resourceGroup.name,virtualNetworkName: `vnet-${config.environment}-${config.location}-001`,subnetName:`snet-private-${config.environment}-${resourceGroup.location}-001`},{provider:azureProvider})

//Create Storage Account
for (const st of config.storageAccounts) {
   await createStorageAccount(`${st}${config.org}`,resourceGroup,config.environment,subnet,config.ipAllow,workspace,config.metricDefStg,azureProvider);
};

//Create Key Vaul
await createKeyVault(`default${config.org}`,config.environment,resourceGroup,subnet,config.tenant,config.applicationId,config.ipAllow,workspace,config.logDefKv,config.metricDefKv,azureProvider)

//Create Recover Service Vault

if(config.environment === 'mgmt')
await createRSV(config.org,resourceGroup,azureProviderOld,azureProvider,workspace,config.diagRSV);


}   

module.exports = {vnet: createResources()};
