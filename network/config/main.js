const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();
const env = pulumi.getStack();

const applicationId = config.getSecret('applicationId');
const password = config.getSecret('password');
const subscription = config.getSecret('subscription');
const tenant = config.getSecret('tenant');
const location = config.require('location');
const vnetAdressPrefix = config.require('vnetAdressPrefix');
const retention = config.getNumber('retention');
const environment = env;
const orgpulumi = config.require('orgpulumi');
const createGatewaySubnet = false;

const rulesPublic = [
    {
        name: 'HTTP',
        priority: 1000,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    },
    {
        name: 'HTTPS',
        priority: 2000,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    }
];

const rulesPrivate = [
    {
        name: 'BlockInternetIN',
        priority: 1000,
        direction: 'Inbound',
        access: 'Deny',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: 'Internet',
        destinationAddressPrefix: '*'
    },
];

const rulesPrivateMgmt = [
    {
        name: 'BlockInternetIN',
        priority: 1000,
        direction: 'Inbound',
        access: 'Deny',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: 'Internet',
        destinationAddressPrefix: '*'
    },
    {
        name: 'OpenVpn1194',
        priority: 3000,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'UDP',
        sourcePortRange: '*',
        destinationPortRange: '1194',
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    }
];



const rulesSecure = [
    {
        name: 'BlockInternetIN',
        priority: 1000,
        direction: 'Inbound',
        access: 'Deny',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: 'Internet',
        destinationAddressPrefix: '*'
    },
    {
        name: 'BlockInternetOut',
        priority: 1000,
        direction: 'Outbound',
        access: 'Deny',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: 'Internet',
        destinationAddressPrefix: '*'
    },
];


const rulesAppGateway = [
    {
        name: 'HTTP',
        priority: 1000,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    },
    {
        name: 'HTTPS',
        priority: 2000,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '*',
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    },
    {
        name: 'GatewayManager',
        priority: 3000,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '65503-65534',
        sourceAddressPrefix: 'GatewayManager',
        destinationAddressPrefix: '*'
    }  
]

serviceEndpoints = [
    {      service: "Microsoft.Storage"},
    {      service: "Microsoft.ContainerRegistry"},
    {      service: "Microsoft.Web"},
    {      service: "Microsoft.Sql"},
    {      service: "Microsoft.KeyVault"},
    {      service: "Microsoft.AzureCosmosDB"},
    
]


const logDefinitionNSG = 
[
    {
    category: 'NetworkSecurityGroupEvent',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'NetworkSecurityGroupRuleCounter',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
]



const logDefinitionVnet = 
[
    {
    category: 'VMProtectionAlerts',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
]

const metricDefinitionVnet = 
[
    {
    category: 'AllMetrics',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
]

module.exports = {applicationId,
    subscription,
    tenant,
    password,
    location,
    rulesPublic,
    rulesPrivate,
    rulesSecure,
    rulesPrivateMgmt,
    environment,
    vnetAdressPrefix,
    serviceEndpoints,
    rulesAppGateway,
    logDefinitionNSG,
    logDefinitionVnet,
    metricDefinitionVnet,
    createGatewaySubnet,
    orgpulumi

}