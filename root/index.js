const pulumi = require("@pulumi/pulumi");
const environment = ['nonprod','prod','mgmt','billing'];
const {UsersAD} = require('./modules/aad/user');
const {createGroups} = require('./modules/aad/group');
const {createServicePrincipal} = require('./modules/aad/sp');
const {createRGs} = require('./modules/core/resourceg');
const {allowViewBilling,denyViewBilling} = require('./modules/authorization/role');
const {assingRole} = require('./modules/authorization/roleAssing');
const {createBudget} = require('./modules/billing/budget')
const {createDefaultPolicies} = require('./modules/policies/main');
const {createWorkspace} = require('./modules/operationalinsights/workspace');
const {createDiagSetting} = require('./modules/insights/diagnostic');
const {EnableSecurityCenter}  = require('./modules/security/securityCenter');

const config = require('./config/main');

/*Enable Security Center*/
EnableSecurityCenter(config.securityResource);

/*Create Budget*/
createBudget(config.subscription,config.budget);

/*Create Roles View e Deny billing*/
const roleAllowViewBilling = allowViewBilling(config.subscription);
const roleDenyViewBilling = denyViewBilling(config.subscription);


/*Create Service Principals*/
let servicesPrincipals = [];
environment.forEach(function(env){
    if (env != 'billing')
    servicesPrincipals.push(createServicePrincipal(env,config.domain,config.orgname,config.seed))
});

/*Create Users*/
let users = [];
environment.forEach(function(env){
    users.push(UsersAD(env,config.domain))
});

/*Create Groups*/
let groups = [];
users.map(u => u.id).forEach(function(us,index) {+
    groups.push(createGroups(us,environment[index],config.orgname));
});

/*Role View Billing*/
environment.forEach(function(env,index){
    if(env === 'billing') {
        assingRole(groups[index].id,roleAllowViewBilling.name,`AlwBill-${env}`,'');
    }else {
        assingRole(groups[index].id,roleDenyViewBilling.name,`DenBill-${env}`,'');
    }
});;

/*Create Resource Groups*/
let resourcegroups = [];
environment.forEach(function(env){
    if (env != 'billing')
    resourcegroups.push(createRGs(env,config.location))
});

/*Create Role Assing Service Principal*/
environment.forEach(function(env,index){
    if (env != 'billing' && env != 'mgmt'){
        assingRole(servicesPrincipals[index].spInfo.id,'Contributor',`rl-rg-${env}-contributor`,resourcegroups[index].id)
        assingRole(servicesPrincipals[2].spInfo.id,'Network Contributor',`rl-rg-${env}-mgmt-net-contributor`,resourcegroups[index].id)
    } else if (env === 'mgmt') {
        assingRole(servicesPrincipals[index].spInfo.id,'Contributor',`rl-rg-${env}-contributor`,resourcegroups[index].id)
    }
    
});

/*Create Role Assing Group*/
 environment.forEach(function(env,index){
     if (env != 'billing')
         assingRole(groups[index].id,'Contributor',`rl-gp-${env}-contributor`,resourcegroups[index].id)
 });

/*Create Log Workspace*/
let workspaces = [];
environment.forEach(function(env,index){
    if (env != 'billing')
    workspaces.push(createWorkspace(config.location,resourcegroups[index].name,config.retention,env));
});


/*Configure Diagnostic Settings for Activity Log*/
createDiagSetting(`/subscriptions/${config.subscription}`, workspaces[2].id, 'diagActivityLog',config.logsDefintionActivyLog,null,null);


/*Set Basic Policies*/
createDefaultPolicies(config.subscription);

let outServicesPrincipals = [];
 servicesPrincipals.forEach(function(s){
    outServicesPrincipals.push(
        pulumi.all([s.passInfo.description,s.spInfo.applicationId,s.passInfo.value]).
            apply(([envr,spr,pass]) => `Environment: ${envr}, Service Principal: ${spr}, Password: ${pass}`)
    );
});

let outUsers = [];
 users.forEach(function(u){
    outUsers.push(
        pulumi.all([u.userPrincipalName,u.password]).
            apply(([us,pasw]) => `User: ${us}, Password: ${pasw}`)
    );
});


 module.exports = {
    outServicesPrincipals, outUsers
 }