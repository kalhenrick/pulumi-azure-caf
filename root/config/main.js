const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();

const roleContributorId = `/subscriptions/${config.require('subscription')}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c`;
const roleNetContributorId = `/subscriptions/${config.require('subscription')}/providers/Microsoft.Authorization/roleDefinitions/4d97b98b-1d4f-4787-a291-c67834d212e7`;
const orgname = config.require('organization');
const domain = config.require('domain');
const seed = config.require('seed');
const subscription = config.require('subscription');
const location = config.get('location');
const budget = config.getNumber('budget');
const retention = config.getNumber('retention');

const logsDefintionActivyLog = [{
    category: 'Security',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
    category: 'Administrative',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
    category: 'ServiceHealth',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
    category: 'Alert',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
    category: 'Recommendation',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
    category: 'Policy',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
    category: 'Autoscale',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
    category: 'ResourceHealth',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: false,
    },
}]

module.exports = {roleContributorId, orgname, domain, seed, subscription, location, budget, retention, logsDefintionActivyLog, roleNetContributorId}   