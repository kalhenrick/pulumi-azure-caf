const pulumi = require("@pulumi/pulumi");
const azuread  = require("@pulumi/azuread");
const config = new pulumi.Config();

function createGroups(user,env,orgname){
        const gp = new azuread.Group(`gp-${orgname}-${env}`, {preventDuplicateNames : true});
        const groupMember = new azuread.GroupMember(`GroupMember-${orgname}-${env}`, {
            groupObjectId: gp.id,
            memberObjectId: user,
        });
        return gp;
}

module.exports = { createGroups }