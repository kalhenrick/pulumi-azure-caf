const azure_nextgen = require("@pulumi/azure-nextgen");
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
    
    return azureProvider;
}

module.exports = {getAzureProvider}

