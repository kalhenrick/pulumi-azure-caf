const azure_nextgen =  require("@pulumi/azure-nextgen");

async function createPeeringVnet(namePeering,vnetSourceName,vnetDest,rg,azureProvider) {
    const peering = await new azure_nextgen.network.latest.VirtualNetworkPeering(namePeering, {
        allowForwardedTraffic: true,
        allowGatewayTransit: true,
        allowVirtualNetworkAccess: true,
        remoteVirtualNetwork: {
            id: vnetDest.id,
        },
        resourceGroupName: rg,
        useRemoteGateways: false,
        virtualNetworkName: vnetSourceName,
        virtualNetworkPeeringName: namePeering,
        name: namePeering,
    },{provider: azureProvider});
    return peering;
}

module.exports = {
    createPeeringVnet
}