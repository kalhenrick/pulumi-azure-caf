const azure_nextgen = require("@pulumi/azure-nextgen");

async function CreatePool({poolName, env,rg, clusterName, vmDefinition, az, azureProvider, depenResource }) {

    const agentPool = new azure_nextgen.containerservice.latest.AgentPool(poolName, {
        agentPoolName: poolName,
        count: vmDefinition.countPool,
        osType: vmDefinition.typeOS,
        resourceGroupName: rg.name,
        resourceName: clusterName,
        vmSize: vmDefinition.vmSizePool,
        maxCount: vmDefinition.maxCountPoll,
        minCount: vmDefinition.minCountPoll,
        maxPods: vmDefinition.maxPodsPoll,
        availabilityZones: az,
        osDiskSizeGB: vmDefinition.osDiskSizeGBPoll,
        scaleSetPriority: vmDefinition.scaleSetPriorityUserPool,
        enableAutoScaling: vmDefinition.enableAutoScaling,
        enableNodePublicIP:vmDefinition.enableNodePublicIP,
        vnetSubnetID: vmDefinition.vnetSubnetID,
        mode: 'User',
        tags: {
            aks: clusterName,
            name: poolName,
            environment: env,
        }

    },{provider: azureProvider, dependsOn:depenResource});
    
    return agentPool;

}


module.exports = {
    CreatePool
}