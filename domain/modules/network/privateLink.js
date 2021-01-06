const azure_nextgen = require("@pulumi/azure-nextgen");


async function createVnetPrivLink(name,zone,rg,vnet,env,azureProvider) {
    const virtualNetworkLink = await new azure_nextgen.network.latest.VirtualNetworkLink("virtualNetworkLink", {
        location: "Global",
        privateZoneName: zone.name,
        registrationEnabled: true,
        resourceGroupName: rg.name,
        tags : {
            name: name,
            environment: env,
        },
        virtualNetwork: {
            id: vnet.id,
        },
        virtualNetworkLinkName: name,
    },{provider: azureProvider});
    return virtualNetworkLink;
}

module.exports = {
    createVnetPrivLink
}
