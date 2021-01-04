module.exports = async() => {
    const resourceGroup =  await azure_nextgen.resources.latest.getResourceGroup(
        {resourceGroupName: `rg-${config.environment}-${config.location}-001`},{provider:azureProvider}); 
    return resourceGroup;
}