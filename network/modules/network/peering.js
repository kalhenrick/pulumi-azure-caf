const azure_nextgen =  require("@pulumi/azure-nextgen");

async function createPeeringVnet(vnetSource,vnetDest,rg,azureProvider) {
    const virtualNetworkPeering = new azure_nextgen.network.latest.VirtualNetworkPeering("virtualNetworkPeering", {
        allowForwardedTraffic: true,
        allowGatewayTransit: false,
        allowVirtualNetworkAccess: true,
        remoteVirtualNetwork: {
            id: "/subscriptions/subid/resourceGroups/peerTest/providers/Microsoft.Network/virtualNetworks/vnet2",
        },
        resourceGroupName: "peerTest",
        useRemoteGateways: false,
        virtualNetworkName: "vnet1",
        virtualNetworkPeeringName: "peer",
    });
}