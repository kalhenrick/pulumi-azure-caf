const pulumi = require("@pulumi/pulumi");
const azure = require("@pulumi/azure");

let config = new pulumi.Config();



function assingRole(pId,RlId,RlAsName,roleScope,azureProvider) {
    let scopeId = '';
    if (roleScope === '') {
          const subscription = config.require('subscription');
         scopeId = `/subscriptions/${subscription}`;
    } else {
         scopeId = roleScope;
    }
    
       const assing =  new azure.authorization.Assignment(`rl${RlAsName}`, {
        scope: scopeId,
        principalId: pId,
        roleDefinitionName: RlId
    },{provider: azureProvider});

    return assing;

}



module.exports = {assingRole}