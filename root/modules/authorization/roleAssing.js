const azure_nextgen = require("@pulumi/azure-nextgen");
const azure = require("@pulumi/azure");
const pulumi = require("@pulumi/pulumi");
let config = new pulumi.Config();



function assingRole(pId,RlId,RlAsName,roleScope) {
    if (roleScope != '') {
        const subscription = config.require('subscription');;
        const scopeId = `/subscriptions/${subscription}`;
    } else {
        scopeId = roleScope;
    }
    
    return new azure_nextgen.authorization.latest.RoleAssignment(`roleAssig${RlAsName}`, {
        properties: {
            principalId: pId,
            roleDefinitionId: RlId,
        },
        roleAssignmentName: `roleAssig${RlAsName}`,
        scope: scopeId,
    });
}



module.exports = {assingRole}