const azure_nextgen =  require("@pulumi/azure-nextgen");
const pulumi = require("@pulumi/pulumi");
const config = require('./config/main');
const {createNSG} = require('./modules/network/securityGroup');
const {createVNET} = require('./modules/network/virtualNetwork');
const {createSubsnet} = require('./modules/network/subnet');
const {createPeeringVnet} = require('./modules/network/peering');

async function createResources()  {

let nsgAppGateway = null;
const rulesPrivate = config.environment === 'mgmt' ? config.rulesPrivateMgmt  : config.rulesPrivate;

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

if( config.environment === 'mgmt' && config.createGatewaySubnet)
await createSubsnet(`${config.vnetAdressPrefix}.100.0/24`,resourceGroup,config.environment,vnet.name,'GatewaySubnet',nsgAppGateway,config.serviceEndpoints,azureProvider,true);

if( config.environment === 'mgmt' ) {
    const project = await pulumi.getProject();
    const stackNonprod = await new pulumi.StackReference(`${config.orgpulumi}/${project}/nonprod`);
    const stackProd = await new pulumi.StackReference(`${config.orgpulumi}/${project}/prod`);
    createPeeringVnet('peer-mgmt-to-nonprod',vnet.name,stackNonprod.getOutput('vnet'),`rg-mgmt-${config.location}-001`,azureProvider);
    createPeeringVnet('peer-mgmt-to-prod',vnet.name,stackProd.getOutput('vnet'),`rg-mgmt-${config.location}-001`,azureProvider);
    createPeeringVnet('peer-nonprod-to-mgmt',stackNonprod.getOutput('vnet').name,vnet,`rg-nonprod-${config.location}-001`,azureProvider);
    createPeeringVnet('peer-prod-to-mgmt',stackProd.getOutput('vnet').name,vnet,`rg-prod-${config.location}-001`,azureProvider);
}

   return vnet;
}   



module.exports = {vnet: createResources()};
