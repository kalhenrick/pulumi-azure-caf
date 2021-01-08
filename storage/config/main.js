
const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();
const env = pulumi.getStack();

const applicationId = config.getSecret('applicationId');
const password = config.getSecret('password');
const subscription = config.getSecret('subscription');
const tenant = config.getSecret('tenant');
const location = config.require('location');
const org = config.require('org');
const retention = config.getNumber('retention');
const storageAccounts = config.getObject('storageaccount');
const ipAllow = config.getObject('ipAllow');

const environment = env;

const metricDefStg = [    {
    category: 'Transaction',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},]

const logDefKv = [    {
    category: 'AuditEvent',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},]

const metricDefKv = [    {
    category: 'AllMetrics',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},]

    module.exports = {
        applicationId,
        subscription,
        tenant,
        password,
        location,
        environment,
        metricDefStg,
        storageAccounts,
        ipAllow,
        logDefKv,
        metricDefKv,
        org
    
    }