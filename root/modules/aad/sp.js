const pulumi = require("@pulumi/pulumi");
const azuread  = require("@pulumi/azuread");
const gen = require('random-seed');

 function createServicePrincipal(env,domain,orgname,seed) {    
            let rand = gen.create(`${env}${domain}${seed}`);
            const application = new azuread.Application(`app-${orgname}-${env}`);

            const servicePrincipal = new azuread.ServicePrincipal(`sp-${orgname}-${env}`, {
                applicationId: application.applicationId});

            const srvicePrincipalPassword = new azuread.ServicePrincipalPassword(`sppw-${orgname}-${env}`, {
             servicePrincipalId: servicePrincipal.id,
                description: `${env}`,
                value: rand.string(32).replace(/[&\/\\#,+()$~%.'":*?<>{}º@¨_-´`!=;\[\]^]/g, ''),
                endDate: "2099-01-01T01:02:03Z",
            });
            const info ={
                spInfo : servicePrincipal,
                passInfo: srvicePrincipalPassword
            }
            return info;

}

module.exports = { createServicePrincipal}