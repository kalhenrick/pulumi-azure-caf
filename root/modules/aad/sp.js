const pulumi = require("@pulumi/pulumi");
const azuread  = require("@pulumi/azuread");
const gen = require('random-seed');
const config = new pulumi.Config();


 function createServicePrincipal(env,domain,orgname,seed) {    
            let rand = gen.create(`${env}${domain}${seed}`);
            const application = new azuread.Application(`app-${orgname}-${env}`);

            const servicePrincipal = new azuread.ServicePrincipal(`sp-${orgname}-${env}`, {
                applicationId: application.applicationId});

            const srvicePrincipalPassword = new azuread.ServicePrincipalPassword(`sppw-${orgname}-${env}`, {
             servicePrincipalId: servicePrincipal.id,
                description: "My managed password",
                value: rand.string(24),
                endDate: "2099-01-01T01:02:03Z",
            });
            const info ={
                spInfo : servicePrincipal,
                passInfo: srvicePrincipalPassword
            }
            return info;

}

module.exports = { createServicePrincipal}