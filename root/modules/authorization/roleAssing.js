const azure_nextgen = require("@pulumi/azure-nextgen");
const pulumi = require("@pulumi/pulumi");
const azure = require("@pulumi/azure");

let config = new pulumi.Config();



function assingRole(pId,RlId,RlAsName,roleScope) {
    const subscription = config.require('subscription');
    let scopeId = '';
    if (roleScope === '') {
         scopeId = `/subscriptions/${subscription}`;
    } else {
         scopeId = roleScope;
    }
    
       return  new azure.authorization.Assignment(`rl${RlAsName}`, {
        scope: scopeId,
        principalId: pId,
        roleDefinitionName: RlId
    });
}



module.exports = {assingRole}