const azure_nextgen = require("@pulumi/azure-nextgen");
const azure = require("@pulumi/azure");
const azuread  = require("@pulumi/azuread");
const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();
const stackRoot = new pulumi.StackReference(`${config.require('org')}/azure-root/root`);


async function getAzureProvider(organization,env) {
    const output = await JSON.parse(await stackRoot.requireOutputValue(env));


    const azureProvider = await new azure_nextgen.Provider('azure',{
        clientId: output.clientId,
        subscriptionId: output.subscriptionId,
        tenantId: output.tenantId,
        clientSecret: output.clientSecret
    });

    const azureProviderOld = await new azure.Provider('azureOld',{
        clientId: output.clientId,
        subscriptionId: output.subscriptionId,
        tenantId: output.tenantId,
        clientSecret: output.clientSecret
    });


    
    return {azureProvider,azureProviderOld };
}

async function getAzureProviderAD(organization,env) {
    const output = await JSON.parse(await stackRoot.requireOutputValue(env));

    const azureProviderAD = new azuread.Provider('azureadProvider',
    {
        clientId: output.clientId,
        clientSecret: output.clientSecret,
        tenantId: output.tenantId,
        metadataHost : 'localhost',
    });

    return azureProviderAD;

}

module.exports = {getAzureProvider,getAzureProviderAD}

