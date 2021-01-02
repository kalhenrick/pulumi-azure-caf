const azure_nextgen = require("@pulumi/azure-nextgen");

function createRGs(env,location){
    return resourceGroup = new azure_nextgen.resources.latest.ResourceGroup(`rg-${env}-${location}-001`, {
        location: location,
        resourceGroupName: `rg-${env}-${location}-001`,
        tags : {
            environment : env,
            name: `rg-${env}-${location}-001`
        }
    });
}

module.exports = { createRGs }