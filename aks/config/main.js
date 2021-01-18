const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();
const env = pulumi.getStack();
const location = config.require('location');
const environment = env;
const clustername = config.require('clustername');
const orgpulumi = config.require('org');
const seed = config.require('seed');
const acrsku = config.require('acrsku');


sshData = '';

vmDefinition = {
        availabilityZones : ['1','2','3'],
        count: 1,
        enableNodePublicIP: false,
        typeOS: 'Linux',
        vmSize: 'Standard_B2s',
        vnetSubnetID: null,
        scaleSetPriority: 'Regular',
        enableAutoScaling: true,
        minCount: 1,
        maxCount: 1,
        maxPods: 50,
        osDiskSizeGB: 30,
    scaleDownDelayAfterAdd:  "15m",
    scanInterval: "30s",
    enablePodSecurityPolicy: false,
    enableRBAC: true,
    enableAzureRBAC: true,
    kubernetesVersion: '1.19.3',
    managedOutboundIPsCount: 1,

}

module.exports = {environment, clustername, orgpulumi, vmDefinition, location, sshData, seed, acrsku}