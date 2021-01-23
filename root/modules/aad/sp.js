const azuread  = require("@pulumi/azuread");
const gen = require('random-seed');

 function CreateServicePrincipal(env,domain,nameResource,seed,isPassword,apiPermissionsSP,azureProviderAD) {    
            let rand = gen.create(`${env}${domain}${seed}`);
            let application = new azuread.Application(`app-${nameResource}`,
            {requiredResourceAccesses:apiPermissionsSP,
             },{provider: azureProviderAD}); //`app-${orgname}-${env}`


            const servicePrincipal = new azuread.ServicePrincipal(`sp-${nameResource}`, { //`sp-${orgname}-${env}`
                applicationId: application.applicationId},{provider: azureProviderAD});

            let srvicePrincipalPassword = null;
            
            if (isPassword) {
                srvicePrincipalPassword = new azuread.ServicePrincipalPassword(`sppw-${nameResource}`, { //`sppw-${orgname}-${env}`
                servicePrincipalId: servicePrincipal.id,
                   description: `${env}`,
                   value: rand.string(32).replace(/[&\/\\#,+()$~%.'":*?<>{}º@¨_-´`!=;\[\]^]/g, ''),
                   endDate: "2099-01-01T01:02:03Z",
               },{provider: azureProviderAD});
            }

            const info ={
                app: application,
                spInfo : servicePrincipal,
                passInfo: srvicePrincipalPassword
            }
            return info;

}

module.exports = { CreateServicePrincipal}