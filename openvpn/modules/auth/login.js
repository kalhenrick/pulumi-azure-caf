const azure_nextgen = require("@pulumi/azure-nextgen");
const azure = require("@pulumi/azure");

const pulumi = require("@pulumi/pulumi");

async function getAzureProvider(organization,env) {
    const stackRoot = await new pulumi.StackReference(`${organization}/azure-root/root`);
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

async function getAzureProviderOld(organization,env) {
    const stackRoot = await new pulumi.StackReference(`${organization}/azure-root/root`);
    const output = await JSON.parse(await stackRoot.requireOutputValue(env));

    const azureProvider = await new azure.Provider('azureOld',{
        clientId: output.clientId,
        subscriptionId: output.subscriptionId,
        tenantId: output.tenantId,
        clientSecret: output.clientSecret
    });
    
    return azureProvider;

}


module.exports = {getAzureProvider}

