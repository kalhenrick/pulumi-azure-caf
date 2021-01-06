const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();
const env = pulumi.getStack();

const applicationId = config.getSecret('applicationId');
const password = config.getSecret('password');
const subscription = config.getSecret('subscription');
const tenant = config.getSecret('tenant');
const location = config.require('location');
const publicDNS = config.require('publicDNS');
const privateDNS = config.require('privateDNS');

const environment = env;

module.exports = {
    env, applicationId, password, subscription, tenant, location, environment, publicDNS, privateDNS
}