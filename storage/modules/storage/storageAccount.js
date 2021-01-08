const azure_nextgen = require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('../../../root/modules/insights/diagnostic');

async function createStorageAccount(name,rg,env,subnet,ipAllow,diag,metricDef,azureProvider) {
    let ipRuleAllow = [];
    for (const ip of ipAllow) {
        ipRuleAllow.push({iPAddressOrRange: ip});
    }

    const storageAccount = await new azure_nextgen.storage.latest.StorageAccount(`st${name}${env}`, {
        accountName: `st${name}${env}`,
        allowBlobPublicAccess: false,
        kind: "Storage",
        location: rg.location,
        minimumTlsVersion: "TLS1_2",
        resourceGroupName: rg.name,
        sku: {
            name: "Standard_LRS",
        },
        tags: {
            "name": `st${name}${env}`,
            environment: env,
        },
        networkRuleSet :{
            defaultAction: 'Deny',
            virtualNetworkRules: [{virtualNetworkResourceId: subnet.id}],
            ipRules: ipRuleAllow,
            bypass: 'Logging,Metrics,AzureServices',
        },
    },{provider: azureProvider});

   await createDiagSetting(storageAccount.id,diag.id,`diag-st${name}${env}`,[],metricDef,null,azureProvider);

    return storageAccount;
}


module.exports = {
    createStorageAccount
}