const azure_nextgen = require("@pulumi/azure-nextgen");

async function createDNSPublic(name,rg,env,azureProvider) {
    const zone = await new azure_nextgen.network.latest.Zone(`public-${name}`, {
        location: 'global',
        resourceGroupName: rg.name,
        tags: {
            name: name,
            environment: env,
        },
        zoneName: name,
        zoneType: 'Public',
    },{provider: azureProvider});
    return zone;
}

module.exports = {
    createDNSPublic
}

