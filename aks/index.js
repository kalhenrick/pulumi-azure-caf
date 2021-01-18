const azure_nextgen = require("@pulumi/azure-nextgen");
const config = require('./config/main');
const {CreateCluster} = require('./modules/containerservice/cluster');
const {getAzureProvider,getAzureProviderAD} = require('../openvpn/modules/auth/login');
const {CreateServicePrincipal} = require('../root/modules/aad/sp')
const {CreateGroups} = require('../root/modules/aad/group')
const {CreateRegistry} = require('./modules/containerregistry/registry');
const {assingRole} = require('../root/modules/authorization/roleAssing');

async function createResources() {
//az feature register --namespace "Microsoft.ContainerService" --name "EnableAzureRBACPreview"
//az provider register --namespace Microsoft.ContainerService

//Get Provider
const provider  = await getAzureProvider(config.orgpulumi,config.environment);
const azureProvider =  provider.azureProvider;
const azureProviderOld =  provider.azureProviderOld;
const azureProviderAD = await getAzureProviderAD('',config.environment);


//Get Resource Grpup Environment
const resourceGroup = await  azure_nextgen.resources.latest.getResourceGroup({resourceGroupName: `rg-${config.environment}-${config.location}-001`},{provider:azureProvider});    
    
// //Get Log Workspace
const workspace = await azure_nextgen.operationalinsights.v20200801.getWorkspace({resourceGroupName: resourceGroup.name,workspaceName:`logw-${config.environment}-default-001`},{provider:azureProvider});
    
//Get Subnet
const subnet = await azure_nextgen.network.latest.getSubnet({resourceGroupName: resourceGroup.name,virtualNetworkName: `vnet-${config.environment}-${resourceGroup.location}-001`,subnetName:`snet-private-${config.environment}-${resourceGroup.location}-001`},{provider:azureProvider})
config.vmDefinition.vnetSubnetID = subnet.id;

//Create Service Principal AKS
const sp = await CreateServicePrincipal(config.environment,resourceGroup.name,`spaks${config.environment}`,config.seed,true,[],azureProviderAD);

//Create Group Admin AKS
const group = await CreateGroups(`${config.clustername}-${config.environment}`,[],azureProviderAD);

//Create Registry
const acr = await CreateRegistry(`arc${config.clustername}`,resourceGroup,config.acrsku,config.environment,subnet,azureProvider);

//Asing Roles AKS sp
await assingRole(sp.spInfo.applicationId,'ArcPull','acrpull',acr.id,azureProviderOld);
await assingRole(sp.spInfo.applicationId,'ArcPush','acrpush',acr.id,azureProviderOld);
await assingRole(sp.spInfo.applicationId,'Network Contributor','subnet-permissions',subnet.id,azureProviderOld);


//Create Cluster
const cluster = await CreateCluster(config.clustername,config.environment,resourceGroup,group,config.vmDefinition,config.sshData,sp.spInfo,sp.passInfo,azureProvider);


}

module.exports = { kube : createResources() }