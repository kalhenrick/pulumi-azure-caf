const azure_nextgen =  require("@pulumi/azure-nextgen");
const config = require('./config/main');
const {createDNSPublic} = require('./modules/network/zonePublic');
const {createDNSPrivate} = require('./modules/network/zonePrivate');
const {createVnetPrivLink} = require('./modules/network/privateLink');


async function createDomain() {
    //Create Provider using Service Principal
    const azureProvider = await new azure_nextgen.Provider('azure',{
        clientId: config.applicationId,
        clientSecret: config.password,
        tenantId: config.tenant,
        subscriptionId: config.subscription
    });

    //Get Resource Grpup Environment
    const resourceGroup = await  azure_nextgen.resources.latest.getResourceGroup({resourceGroupName: `rg-${config.environment}-${config.location}-001`},{provider:azureProvider});    

    ////Get VNET
    const vnet = await azure_nextgen.network.latest.getVirtualNetwork({virtualNetworkName: `vnet-${config.environment}-${config.location}-001`, resourceGroupName: resourceGroup.name},{provider: azureProvider});

    
    //Create Domain    
   const privZone = await createDNSPrivate(`${config.environment}.${config.publicDNS}`,resourceGroup,config.environment,azureProvider)
    await createDNSPublic(`${config.environment}.${config.publicDNS}`,resourceGroup,config.environment,azureProvider);

    //Create Private Link with auto registration
    await createVnetPrivLink(`vnet_link_${config.environment}`,privZone,resourceGroup,vnet,config.environment,azureProvider)


}

 createDomain();