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

const config = require('./config/main');

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
        assingRole(groups[index].id,roleAllowViewBilling.id,`AllowBilling-${env}`,'');
    }else {
        assingRole(groups[index].id,roleDenyViewBilling.id,`DennyBilling-${env}`,'');
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
        assingRole(servicesPrincipals[index].spInfo.id,config.roleContributorId,`rl-rg-${env}-contributor`,resourcegroups[index].id)
        assingRole(servicesPrincipals[2].spInfo.id,config.roleNetContributorId,`rl-rg-${env}-mgmt-net-contributor`,resourcegroups[index].id)
    } else if (env === 'mgmt') {
        assingRole(servicesPrincipals[index].spInfo.id,config.roleContributorId,`rl-rg-${env}-contributor`,resourcegroups[index].id)
    }
    
});

/*Create Role Assing Group*/
environment.forEach(function(env,index){
    if (env != 'billing')
        assingRole(groups[index].id,config.roleContributorId,`rl-gp-${env}-contributor`,resourcegroups[index].id)
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

 module.exports = {
     servicesPrincipals, users
 }