const azure_nextgen = require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('../../../root/modules/insights/diagnostic');


async function CreateRegistry(nameAcr,rg,skuName,env,subnet,diag,diagDef,azureProvider) {
    const registry = await new azure_nextgen.containerregistry.latest.Registry("registry", {
        adminUserEnabled: false,
        location: rg.location,
        registryName: nameAcr,
        resourceGroupName: rg.name,
        sku: {
            name: skuName,
        },
        networkRuleSet : {
            defaultAction : 'Deny',
            virtualNetworkRules :[{virtualNetworkResourceId : subnet.id  }]
        },
        tags: {
            name: nameAcr,
            environment: env
        },
    },{provider: azureProvider});

    await createDiagSetting(registry.id,diag.id,`diag-${nameAcr}`,diagDef.log,diagDef.metric,null,azureProvider)

    return registry;
}

module.exports = {
    CreateRegistry
}
