const azure_nextgen = require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('../../../root/modules/insights/diagnostic');

async function CreateCluster({clusterName,env,rg,group,vmDefinition,sshData,spId,spPass,diag,diagDef,azureProvider}) {

const managedCluster = new azure_nextgen.containerservice.latest.ManagedCluster("managedCluster", {
    aadProfile: {
        enableAzureRBAC: vmDefinition.enableAzureRBAC,
        managed: true,
        adminGroupObjectIDs : [group.objectId],
        // tenantID: sp.tenantId
    },
    addonProfiles: {},
    agentPoolProfiles: [{
        availabilityZones: vmDefinition.availabilityZonesDefault,
        count: vmDefinition.countDefault,
        enableNodePublicIP: vmDefinition.enableNodePublicIP,
        mode: "System",
        name: clusterName,
        osType: "Linux",
        type: "VirtualMachineScaleSets",
        vmSize: vmDefinition.vmSizeDefault,
        vnetSubnetID: vmDefinition.vnetSubnetID,
        scaleSetPriority: vmDefinition.scaleSetPriorityDefaultPool,
        enableAutoScaling: vmDefinition.enableAutoScaling,
        minCount: vmDefinition.minCountDefault,
        maxCount: vmDefinition.maxCountDefault,
        maxPods: vmDefinition.maxPodsDefault,
        osDiskSizeGB: vmDefinition.osDiskSizeGBDefault,
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

await createDiagSetting(managedCluster.id,diag.id,`diag-${clusterName}`,diagDef.log,diagDef.metric,null,azureProvider)

return managedCluster;

}

module.exports = {
    CreateCluster
}