const azure_nextgen = require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('../../../root/modules/insights/diagnostic');


async function createKeyVault(name,env,rg,subnet,tenant,adIdObjct,ipAllow,diag,logDef,metricDef,azureProvider) {

    let ipRuleAllow = [];
    for (const ip of ipAllow) {
        ipRuleAllow.push({value: ip});
    }

    const vault = await new azure_nextgen.keyvault.latest.Vault(`kv-${name}-${env}`, {
        location: rg.location,
        properties: {
            accessPolicies: [{
                objectId: adIdObjct,
                permissions: {
                    certificates: [
                        "get",
                        "list",
                        "delete",
                        "create",
                        "import",
                        "update",
                        "managecontacts",
                        "getissuers",
                        "listissuers",
                        "setissuers",
                        "deleteissuers",
                        "manageissuers",
                        "recover",
                        "purge",
                    ],
                    keys: [
                        "encrypt",
                        "decrypt",
                        "wrapKey",
                        "unwrapKey",
                        "sign",
                        "verify",
                        "get",
                        "list",
                        "create",
                        "update",
                        "import",
                        "delete",
                        "backup",
                        "restore",
                        "recover",
                        "purge",
                    ],
                    secrets: [
                        "get",
                        "list",
                        "set",
                        "delete",
                        "backup",
                        "restore",
                        "recover",
                        "purge",
                    ],
                },
                tenantId: tenant,
            }],
            enabledForDeployment: true,
            enabledForDiskEncryption: true,
            enabledForTemplateDeployment: true,
            networkAcls : {
                bypass: 'AzureServices',
                defaultAction: 'Deny',
                virtualNetworkRules: [{id: subnet.id}],
                ipRules: ipRuleAllow
            },
            sku: {
                family: "A",
                name: "standard",
            },
            tenantId: tenant,
        },
        resourceGroupName: rg.name,
        vaultName: `kv-${name}-${env}`,
        tags: {
            name: `kv-${name}-${env}`,
            environment: env
        }
    },{provider: azureProvider});

   await createDiagSetting(vault.id,diag.id,`diag-kv-${name}-${env}`,logDef,metricDef,null,azureProvider)

    return vault;
}


module.exports = {
    createKeyVault
}

