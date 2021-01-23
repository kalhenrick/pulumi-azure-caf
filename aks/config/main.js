const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();
const env = pulumi.getStack();
const location = config.require('location');
const environment = env;
const clustername = config.require('clustername');
const orgpulumi = config.require('org');
const seed = config.require('seed');
const acrsku = config.require('acrsku');
const retention = config.getNumber('retention');



sshData = '';

vmDefinition = {
        availabilityZonesDefault : ['1','2','3'],
        availabilityZonesPool : ['1','2','3'],
        countDefault: 1,
        countPool: 1,
        enableNodePublicIP: false,
        typeOS: 'Linux',
        vmSizeDefault: 'Standard_B2s',
        vmSizePool: 'Standard_D2_v4',
        vnetSubnetID: null,
        scaleSetPriorityDefaultPool: 'Regular',
        scaleSetPriorityUserPool: 'Spot',
        enableAutoScaling: true,
        minCountDefault: 1,
        maxCountDefault: 1,
        maxPodsDefault: 50,
        osDiskSizeGBDefault: 30,
        minCountPoll: 1,
        maxCountPoll: 1,
        maxPodsPoll: 50,
        osDiskSizeGBPoll: 30,        
    scaleDownDelayAfterAdd:  "15m",
    scanInterval: "30s",
    enablePodSecurityPolicy: false,
    enableRBAC: true,
    enableAzureRBAC: true,
    kubernetesVersion: '1.19.3',
    managedOutboundIPsCount: 1,
}

const diagDefAcr = {
    log : [
        {
        category: 'ContainerRegistryRepositoryEvents',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
        {
            category: 'ContainerRegistryLoginEvents',
            enabled: true,
            retentionPolicy: {
                days: retention,
                enabled: true,
            }},
    ],
    metric: [
        {
            category: 'AllMetrics',
            enabled: true,
            retentionPolicy: {
                days: retention,
                enabled: true,
            }},
    ]
}

const diagDefAks = {
    log : [
        {
        category: 'kube-apiserver',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
        {
        category: 'kube-audit',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
        {
        category: 'kube-audit-admin',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
        {
        category: 'kube-controller-manager',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
        {
        category: 'kube-scheduler',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
        {
        category: 'cluster-autoscaler',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
        {
        category: 'guard',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},

    ],
    metric: [
                {
        category: 'API Server (PREVIEW)',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
    ]
}


module.exports = {environment, clustername, orgpulumi, vmDefinition, location, sshData, seed, acrsku, retention, diagDefAcr, diagDefAks}