const azure = require("@pulumi/azure");
const azure_nextgen = require("@pulumi/azure-nextgen");
const {PoliciesDefs, policyDeployLinuxAgentId, policyDeployWindowsAgentId} =require("./policies");
const {assingRole} = require('../authorization/roleAssing');


function createDefaultPolicies(subscription,localization){
    for (const policiesDef of PoliciesDefs) {
        const EnableAzureMonitorforVMScaleSets = new azure.policy.Assignment(policiesDef.name,{
            policyDefinitionId : policiesDef.id,
            scope: `/subscriptions/${subscription}`,
            parameters : policiesDef.params,
            identity: policiesDef.identy,
            location: localization
        });
    }
}


function createPolicyVmAgent(rg,env,location,subscription) {
    
    const policyDeployAgentLinux = new azure.policy.Assignment(`${env}-agent-lx`,{
        policyDefinitionId: policyDeployLinuxAgentId,
        scope: rg.id,
        parameters : `{"logAnalytics": {"value": "/subscriptions/${subscription}/resourcegroups/rg-${env}-${location}-001/providers/microsoft.operationalinsights/workspaces/logw-${env}-default-001"}}`,
        identity: {
            type: 'SystemAssigned'
        },
        location: rg.location
    });

    const roleAssinLogLx = assingRole(policyDeployAgentLinux.identity.principalId,'Log Analytics Contributor',`assing-${env}-agent-lx`,rg.id);

    const policyRemediationAgentLinux = new azure.policy.Remediation(`r-${env}-agent-l`,{
        scope: rg.id,
        policyAssignmentId: policyDeployAgentLinux.id,
    });



    const policyDeployAgentWindows = new azure.policy.Assignment(`${env}-agent-ws`,{
        policyDefinitionId: policyDeployWindowsAgentId,
        scope: rg.id,
        parameters : `{"logAnalytics": {"value": "/subscriptions/${subscription}/resourcegroups/rg-${env}-${location}-001/providers/microsoft.operationalinsights/workspaces/logw-${env}-default-001"}}`,
        identity: {
            type: 'SystemAssigned',
        },
        location: rg.location
    });

    const roleAssinLogWin = assingRole(policyDeployAgentWindows.identity.principalId,'Log Analytics Contributor',`assing-${env}-agent-ws`,rg.id);

    const policyRemediationAgentWinodws = new azure.policy.Remediation(`r-${env}-agent-w`,{
        scope: rg.id,
        policyAssignmentId: policyDeployAgentWindows.id,
    });

    return null;

}

module.exports = {createDefaultPolicies,createPolicyVmAgent}
