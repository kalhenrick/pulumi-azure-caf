const pulumi = require("@pulumi/pulumi");
const azure = require("@pulumi/azure");
const config = new pulumi.Config();
const {PoliciesDefs} =require("./policies");

function createDefaultPolicies(subscription){
    for (const policiesDef of PoliciesDefs) {
        const EnableAzureMonitorforVMScaleSets = new azure.policy.Assignment(policiesDef.name,{
            policyDefinitionId : policiesDef.id,
            scope: `/subscriptions/${subscription}`,
            parameters : policiesDef.params
        });
    }
}

module.exports = {createDefaultPolicies}
