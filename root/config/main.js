const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();

const orgname = config.require('organization');
const domain = config.require('domain');
const seed = config.require('seed');
const tenant = config.require('tenant');
const subscription = config.require('subscription');
const location = config.get('location');
const budget = config.getNumber('budget');
const retention = config.getNumber('retention');
const securityResource = config.getObject('securityResource');
const budgetAlertEmail = config.getObject('budgetAlertEmail');


const apiPermissionsSP = [
    {
        resourceAppId : '00000002-0000-0000-c000-000000000000',
        resourceAccesses : [ {id: '78c8a3c8-a07e-4b9e-af1b-b5ccab50a175',type : 'Role' },{id: '1cda74f2-2616-4834-b122-5cb1b07f8a59',type : 'Role' }]
    }
   ];

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

module.exports = {
    apiPermissionsSP, 
    orgname,
    domain,
    seed,
    subscription,
    location, budget, retention, logsDefintionActivyLog, securityResource,tenant, budgetAlertEmail}   