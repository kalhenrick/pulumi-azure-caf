const azure_nextgen = require("@pulumi/azure-nextgen");
const azuread  = require("@pulumi/azuread");
const config = require('./config/main');
const {CreateCluster} = require('./modules/containerservice/cluster');
const {getAzureProvider,getAzureProviderAD} = require('../openvpn/modules/auth/login');
const {CreateServicePrincipal} = require('../root/modules/aad/sp')
const {CreateGroups} = require('../root/modules/aad/group')
const {CreateRegistry} = require('./modules/containerregistry/registry');
const {CreatePool} = require('./modules/containerservice/pool');
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
const resourceGroup = await  azure_nextgen.resources.latest.getResourceGroup(
    {resourceGroupName: `rg-${config.environment}-${config.location}-001`},{provider:azureProvider});    
    
// //Get Log Workspace
const workspace = await azure_nextgen.operationalinsights.v20200801.getWorkspace(
    {resourceGroupName: resourceGroup.name,workspaceName:`logw-${config.environment}-default-001`},{provider:azureProvider});
    
//Get Subnet
const subnet = await azure_nextgen.network.latest.getSubnet({
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: `vnet-${config.environment}-${resourceGroup.location}-001`,
    subnetName:`snet-private-${config.environment}-${resourceGroup.location}-001`},
    {provider:azureProvider})
    config.vmDefinition.vnetSubnetID = subnet.id;

//Get Current Service Principal
// const currentServicePrincipal = await azuread.getServicePrincipal({displayName: `app-master-nonprod-60b78d5`},{provider:azureProviderAD, async: true});

//Create Service Principal AKS
const sp = await CreateServicePrincipal(config.environment,resourceGroup.name,`spaks${config.environment}`,config.seed,true,[],azureProviderAD);

//Create Group Admin AKS
const group = await CreateGroups(`${config.clustername}-${config.environment}`,[],azureProviderAD);

//Create Registry
const acr = await CreateRegistry({
    nameAcr: `arc${config.clustername}`,
    rg: resourceGroup,
    skuName: config.acrsku,
    env: config.environment,
    subnet: subnet,
    diag: workspace,
    diagDef: config.diagDefAcr,
    azureProvider: azureProvider
});

//Asing Roles AKS sp
await assingRole(sp.spInfo.id,'AcrPull','acrpull',acr.id,azureProviderOld);
await assingRole(sp.spInfo.id,'AcrPush','acrpush',acr.id,azureProviderOld);
await assingRole(sp.spInfo.id,'Network Contributor','subnet-permissions',subnet.id,azureProviderOld);


//Create Cluster
const cluster = await CreateCluster({
    clusterName: config.clustername,
    env: config.environment,
    rg: resourceGroup,group,
    vmDefinition: config.vmDefinition,
    sshData: config.sshData,
    spId: sp.spInfo,
    spPass: sp.passInfo,
    diag: workspace,
    diagDef: config.diagDefAks,
    azureProvider: azureProvider
    });



//Create Pools Cluster
for ( const zone of config.vmDefinition.availabilityZonesPool) {
    await CreatePool({
        poolName: `poolaz${zone}`,
        clusterName: cluster.name,
        rg: resourceGroup,
        az: [zone],
        env: config.environment,
        vmDefinition: config.vmDefinition,
        azureProvider: azureProvider
    });
}


//Assing Permission Cluster Admin for Group
await assingRole(group.id,'Azure Kubernetes Service RBAC Cluster Admin','aks-permission',cluster.id,azureProviderOld);

//Assing Permission Cluster Admin for  Service Principal
//await assingRole('','Azure Kubernetes Service RBAC Cluster Admin','aks-permission',cluster.id,azureProviderOld);


}

module.exports = { kube : createResources() }