const azure_nextgen = require("@pulumi/azure-nextgen");

async function createDNSPrivate(name,rg,env,azureProvider) {
    const zone = await new azure_nextgen.network.latest.PrivateZone(`private-${name}`, {
        privateZoneName: name,
        location: 'global',
        resourceGroupName: rg.name,
        tags : {
            name: name,
            environment: env,
        }
    },{provider: azureProvider});
    return zone;
}

module.exports = {
    createDNSPrivate
}

