const azure_nextgen = require("@pulumi/azure-nextgen");

async function CreateCluster(clusterName,env,rg, group,vmDefinition,sshData,spId,spPass,azureProvider) {

const managedCluster = new azure_nextgen.containerservice.latest.ManagedCluster("managedCluster", {
    aadProfile: {
        enableAzureRBAC: vmDefinition.enableAzureRBAC,
        managed: true,
        adminGroupObjectIDs : [group.objectId],
        // tenantID: sp.tenantId
    },
    addonProfiles: {},
    agentPoolProfiles: [{
        availabilityZones: vmDefinition.availabilityZones,
        count: vmDefinition.count,
        enableNodePublicIP: vmDefinition.enableNodePublicIP,
        mode: "System",
        name: clusterName,
        osType: vmDefinition.osType,
        type: "VirtualMachineScaleSets",
        vmSize: vmDefinition.vmSize,
        vnetSubnetID: vmDefinition.vnetSubnetID,
        scaleSetPriority: vmDefinition.scaleSetPriority,
        enableAutoScaling: vmDefinition.enableAutoScaling,
        minCount: vmDefinition.minCount,
        maxCount: vmDefinition.maxCount,
        maxPods: vmDefinition.maxPods,
        osDiskSizeGB: vmDefinition.osDiskSizeGB,
    }],
    nodeResourceGroup: `rg-node-${clusterName}`,
    autoScalerProfile: {
        scaleDownDelayAfterAdd: vmDefinition.scaleDownDelayAfterAdd,
        scanInterval: vmDefinition.scanInterval,
    },
    dnsPrefix: clusterName,
    enablePodSecurityPolicy: vmDefinition.enablePodSecurityPolicy,
    enableRBAC: vmDefinition.enableRBAC,
    kubernetesVersion: vmDefinition.kubernetesVersion,
    linuxProfile: {
        adminUsername: `usraks${env}`,
        ssh: {
            publicKeys: [{
                keyData: sshData,
            }],
        },
    },
    networkProfile: {
        loadBalancerProfile: {
            managedOutboundIPs: {
                count: vmDefinition.managedOutboundIPsCount,
            },
        },
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
    },
    location: rg.location,
    resourceGroupName:rg.name,
    resourceName: clusterName,
    sku: {
        name: "Basic",
        tier: "Free",
    },
    tags: {
        name: clusterName,
        environment: env,
    },
    servicePrincipalProfile : {
        clientId: spId.applicationId,
        secret: spPass.value
    }

},{provider: azureProvider});

return managedCluster;

}

module.exports = {
    CreateCluster
}