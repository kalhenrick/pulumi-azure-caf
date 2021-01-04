const azure_nextgen =  require("@pulumi/azure-nextgen");
const azure = require("@pulumi/azure");
const config = require('./config/main');
const {createNSG} = require('./modules/network/securityGroup');
const {createVNET} = require('./modules/network/virtualNetwork');
const {createSubsnet} = require('./modules/network/subnet');

async function createResources()  {

let nsgAppGateway = null;
const rulesPrivate =config.environment === 'mgmt' ? config.rulesPrivate.push(config.ruleOpenVPN)  : config.rulesPrivate;

//Create Provider using Service Principal
const azureProvider = await new azure_nextgen.Provider('azure',{
    clientId: config.applicationId,
    clientSecret: config.password,
    tenantId: config.tenant,
    subscriptionId: config.subscription
});

//Get Resource Grpup Environment
const resourceGroup = await  azure_nextgen.resources.latest.getResourceGroup(
        {resourceGroupName: `rg-${config.environment}-${config.location}-001`},{provider:azureProvider});    

//Get Log Workspace
const workspace = await azure_nextgen.operationalinsights.v20200801.getWorkspace({resourceGroupName: resourceGroup.name,workspaceName:`logw-${config.environment}-default-001`},{provider:azureProvider});

//Create Vnet
const vnet = await createVNET(config.vnetAdressPrefix,resourceGroup,config.environment,azureProvider,workspace.id,config.logDefinitionVnet,config.metricDefinitionVnet);

//Create NSGs
const nsgPublic  = await createNSG(resourceGroup,config.environment,'public',config.rulesPublic,azureProvider,workspace.id,config.logDefinitionNSG);
const nsgPrivate = await createNSG(resourceGroup,config.environment,'private', rulesPrivate,azureProvider,workspace.id,config.logDefinitionNSG);
const nsgSecure  = await createNSG(resourceGroup,config.environment,'secure',config.rulesSecure,azureProvider,workspace.id,config.logDefinitionNSG);

if(config.environment != 'mgmt') 
nsgAppGateway  = await createNSG(resourceGroup,config.environment,'appgw',config.rulesAppGateway,azureProvider,workspace.id,config.logDefinitionNSG);

//Create Subnet
const snetPublic = await createSubsnet(`${config.vnetAdressPrefix}.1.0/24`,resourceGroup,config.environment,vnet.name,'public',nsgPublic,config.serviceEndpoints,azureProvider,false);
const snetPrivate = await createSubsnet(`${config.vnetAdressPrefix}.2.0/24`,resourceGroup,config.environment,vnet.name,'private',nsgPrivate,config.serviceEndpoints,azureProvider,false);
const snetSecure = await createSubsnet(`${config.vnetAdressPrefix}.3.0/24`,resourceGroup,config.environment,vnet.name,'secure',nsgSecure,config.serviceEndpoints,azureProvider,false);

if( config.environment != 'mgmt' )
await createSubsnet(`${config.vnetAdressPrefix}.4.0/24`,resourceGroup,config.environment,vnet.name,'appgateway',nsgAppGateway,config.serviceEndpoints,azureProvider,false);

if( config.environment === 'mgmt' && createGatewaySubnet)
await createSubsnet(`${config.vnetAdressPrefix}.100.0/24`,resourceGroup,config.environment,vnet.name,'GatewaySubnet',nsgAppGateway,config.serviceEndpoints,azureProvider,true);

// if( config.environment === 'mgmt' ) {
//    const vnetNonprod =  await azure_nextgen.network.latest.getVirtualNetwork({virtualNetworkName: '',resourceGroupName: ''});
//    const vnetProd =  await azure_nextgen.network.latest.getVirtualNetwork({virtualNetworkName: '',resourceGroupName: ''});
// }
   return vnet;
}   



module.exports = {vnet: createResources()};
