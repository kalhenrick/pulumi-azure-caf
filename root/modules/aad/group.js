const pulumi = require("@pulumi/pulumi");
const azuread  = require("@pulumi/azuread");
const config = new pulumi.Config();

function CreateGroups(gpname,users,azureProviderAD){
        const gp = new azuread.Group(`gp-${gpname}`, {preventDuplicateNames : true},{provider: azureProviderAD});

        for (const user of users) {
            const groupMember = new azuread.GroupMember(`GroupMember-${gpname}`, {
                groupObjectId: gp.id,
                memberObjectId: user,
            },{provider: azureProviderAD});
        }


        return gp;
}

module.exports = { CreateGroups }