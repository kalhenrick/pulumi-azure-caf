const pulumi = require("@pulumi/pulumi");
const fs = require('fs');
const config = new pulumi.Config();
const env = pulumi.getStack();



const applicationId = config.getSecret('applicationId');
const password = config.getSecret('password');
const subscription = config.getSecret('subscription');
const tenant = config.getSecret('tenant');
const location = config.require('location');
const retention = config.getNumber('retention');
const organization = config.require('org');;
const orgpulumi = config.require('orgpulumi');
const extension = fs.readFileSync('config/install.sh','utf-8');


const environment = env;

const diagPIP = {
    log : [    {
        category: 'DDoSProtectionNotifications',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
    {
        category: 'DDoSMitigationFlowLogs',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
    {
        category: 'DDoSMitigationReports',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},        
    ]
    
    , metric : [    {
        category: 'AllMetrics',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
    ]    
}

const diagNIC = {
     metric : [    {
        category: 'AllMetrics',
        enabled: true,
        retentionPolicy: {
            days: retention,
            enabled: true,
        }},
    ]    
}


const vmOpenVpn = {
    vmSize: 'Standard_D2_v4',
    vmName: 'openvpn',
    computerName: 'openvpn',
    adminUsername: 'usropenvpn',
    imgOffer: 'UbuntuServer',
    imgPublisher: 'Canonical',
    imgSku: '18.04-LTS',
    imgVersion: 'latest',
    diskCaching: 'ReadWrite',
    diskCreateOption: 'fromImage',
    diskStorageAccountType: 'Standard_LRS',
    diskName : 'openvpn',
    priority: 'Spot',
    publicIp: true,
    extension: true,
    backupVm: true

};

const sshInfo = {
    data: ''
}


module.exports = {
applicationId,
password,
subscription,
tenant,
location,
retention,
environment,
vmOpenVpn,
sshInfo,
organization,
diagPIP,
diagNIC,
orgpulumi,
extension
}


