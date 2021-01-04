const azure_nextgen =  require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('./../../../root/modules/insights/diagnostic');


async function createVNET(vnetPrefixIp,rg,env,azureProvider,workspace,logDef,metricDef) {
    const vnet = await new azure_nextgen.network.latest.VirtualNetwork(`vnet-${env}-${rg.location}-001`, {
        addressSpace: {
            addressPrefixes: [`${vnetPrefixIp}.0.0/16`],
        },
        location: rg.location,
        resourceGroupName: rg.name,
        virtualNetworkName: `vnet-${env}-${rg.location}-001`,
        tags : {
            "environment": env,
            "name": `vnet-${env}-${rg.location}-001`
        }
    },{provider: azureProvider});

    await createDiagSetting(vnet.id,workspace,`diag-vnet-${env}-${rg.location}-001`,logDef,metricDef,null,azureProvider);


    return vnet;
}

module.exports = {
    createVNET
}