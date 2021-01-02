const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();

const orgname = config.require('organization');
const domain = config.require('domain');
const seed = config.require('seed');
const subscription = config.require('subscription');
const location = config.get('location');
const budget = config.getNumber('budget');
const retention = config.getNumber('retention');
const securityResource = config.getObject('securityResource');

const logsDefintionActivyLog = [
    {
    category: 'Security',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'Administrative',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'ServiceHealth',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'Alert',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'Recommendation',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'Policy',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'Autoscale',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }},
    {
    category: 'ResourceHealth',
    enabled: true,
    retentionPolicy: {
        days: retention,
        enabled: true,
    }}
]

module.exports = { orgname, domain, seed, subscription, location, budget, retention, logsDefintionActivyLog, securityResource}   