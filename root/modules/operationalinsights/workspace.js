const azure_nextgen = require("@pulumi/azure-nextgen");

function createWorkspace(localization,resourceGroup,retention,env) {
    return new azure_nextgen.operationalinsights.latest.Workspace(`logw-${env}-default-001`, {
        location: localization,
        resourceGroupName: resourceGroup,
        retentionInDays: retention,
        sku: {
            name: "PerGB2018",
        },
        tags: {
            name: `logw-${env}-default-001`,
        },
        workspaceName: `logw-${env}-default-001`,
    });
}

module.exports = { createWorkspace }