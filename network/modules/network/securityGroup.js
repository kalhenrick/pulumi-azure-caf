const azure_nextgen =  require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('./../../../root/modules/insights/diagnostic');


async function createNSG(rg,env,name,rules,providerAzure,workspace,logDef) {
    const nsg = await new azure_nextgen.network.latest.NetworkSecurityGroup(`nsg-${env}-${name}-001`, {
        location: rg.location,
        networkSecurityGroupName: `nsg-${env}-${name}-001`,
        resourceGroupName: rg.name,
        securityRules : rules,
        tags: {
            "environment": env,
            "name": `nsg-${env}-${name}-001`
        }
    },{provider:providerAzure });

    await createDiagSetting(nsg.id,workspace,`diag-nsg-${env}-${name}`,logDef,null,null,providerAzure);


    return nsg;
}

module.exports = {
    createNSG
}



