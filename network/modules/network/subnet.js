const azure_nextgen =  require("@pulumi/azure-nextgen");
const { AzureFirewallRCActionType } = require("@pulumi/azure-nextgen/network/v20200601");

async function createSubsnet(subnetPrefixIp,rg,env,vnetName,name,securityGroup,endpoints,azureProvider,overrideNameconv) {
    const subnet = await new azure_nextgen.network.latest.Subnet(`snet-${env}-${rg.location}-${name}-001`, {
        addressPrefix: subnetPrefixIp,
        resourceGroupName: rg.name,
        subnetName: overrideNameconv ? name : `snet-${name}-${env}-${rg.location}-001`,
        virtualNetworkName: vnetName,
        networkSecurityGroup: securityGroup.NetworkSecurityGroup,
        serviceEndpoints: endpoints
    },{provider: azureProvider});
    return subnet;
}


module.exports = {
    createSubsnet
}