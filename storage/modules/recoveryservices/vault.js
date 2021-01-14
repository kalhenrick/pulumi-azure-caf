const azure = require("@pulumi/azure");
const azure_nextgen = require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('../../../root/modules/insights/diagnostic');


async function createDefaultPolicyBkp(rsv,namePolicy,type,wkType,rg,azureProvider) {
    const protectionPolicy = new azure_nextgen.recoveryservices.latest.ProtectionPolicy(namePolicy, {
        policyName: namePolicy,
        properties: {
            backupManagementType: type,
            retentionPolicy: {
                dailySchedule: {
                    retentionDuration: {
                        count: 7,
                        durationType: "Days",
                    },
                    retentionTimes: ["2021-01-31T02:00:00Z"],
                },
                retentionPolicyType: "LongTermRetentionPolicy",
            },
            workLoadType : wkType,
            schedulePolicy: {
                schedulePolicyType: "SimpleSchedulePolicy",
                scheduleRunFrequency: "Daily",
                scheduleRunTimes: ["2021-01-31T02:00:00Z"],
            },
            timeZone: "Pacific Standard Time",
        },
        resourceGroupName: rg.name,
        vaultName: rsv,
        tags : {
            name: namePolicy,
            environment: 'mgmt'
        }
    },{provider: azureProvider});
    return protectionPolicy;
}

async function createRSV(name,rg,azureProviderOld,azureProviderNew,diag,diagDef) {
    const rsv = await new azure.recoveryservices.Vault(`rsv-${name}-${rg.location}`,
    {
        softDeleteEnabled: false,
        resourceGroupName: rg.name,
        location: rg.location,
        name: `rsv-${name}-${rg.location}`,
        sku: 'Standard',
        tags : {
            name: `rsv-${name}-${rg.location}`,
            environment: 'mgmt'
        }
    },{provider: azureProviderOld});


    await createDefaultPolicyBkp(rsv.name,'defaultBackupVm','AzureIaasVM','VM',rg,azureProviderNew);
    await createDefaultPolicyBkp(rsv.name,'defaultBackupSta','AzureStorage','AzureFileShare',rg,azureProviderNew);
    await createDiagSetting(rsv.id,diag.id,`diag-rsv-${name}-${rg.location}`,diagDef.log,null,null,azureProviderNew);

    return rsv;
}

module.exports = {
    createRSV,createDefaultPolicyBkp
}