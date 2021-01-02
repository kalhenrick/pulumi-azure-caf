const azure = require("@pulumi/azure");

function EnableSecurityCenter(resources) {
    resources.forEach(function(rs){
        const securityResource = new azure.securitycenter.SubscriptionPricing(`security-${rs}`, {
            resourceType: rs,
            tier: "Standard",
        });
    });
}

module.exports = { EnableSecurityCenter }