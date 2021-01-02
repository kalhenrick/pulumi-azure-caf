const pulumi = require("@pulumi/pulumi");
const azuread  = require("@pulumi/azuread");
const gen = require('random-seed');
const config = new pulumi.Config();


function UsersAD(env,domain) {
    let rand = gen.create(`${env}${domain}`);
    const user = new azuread.User(`usr-${env}`, {
                        displayName: `${env} User`,
                        mailNickname: `${env}`,
                        password: rand.string(16),
                        userPrincipalName: `usr-${env}@${domain}`,
                        forcePasswordChange: true,
                    });
    return user;
}

module.exports = {UsersAD}   