const azure = require("@pulumi/azure");
const azure_nextgen = require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('../../../root/modules/insights/diagnostic');

async function createBackupVm(rsv,rg,bkPpolicy,vmId,vmName, azureProvider) {
    const st = bkPpolicy.toString().replace('Subscriptions','subscriptions');
    const protectedItem = await new azure.backup.ProtectedVM(`protect-${vmName}`,{
        backupPolicyId : st,
        resourceGroupName: rg.name,
        recoveryVaultName: rsv,
        sourceVmId: vmId,
        tags : {
            name: `protect-${vmName}`,
            environment: 'mgmt'
        }
    },{provider: azureProvider});

    //Bug in create autorest/azure: error response cannot be parsed: "" error: EOF
    // const protectedItem = await new azure_nextgen.recoveryservices.latest.ProtectedItem(`protect-${vmName}`, {
    //     containerName: `IaasVMContainer;iaasvmcontainerv2;${rg.name};${vmName}`,
    //     fabricName: "Azure",
    //     properties: {
    //         policyId: bkPpolicy.id,
    //         protectedItemType: "Microsoft.Compute/virtualMachines",
    //         sourceResourceId: vmId,
    //     },
    //     protectedItemName: `VM;iaasvmcontainerv2;${rg.name};${vmName}`,
    //     resourceGroupName: rg.name,
    //     vaultName: rsv,
    // },{provider: azureProvider});

    return protectedItem;
}

async function createDefaultPolicyBkp(rsv,namePolicy,type,wkType,rg,azureProvider) {
    const protectionPolicy = await new azure_nextgen.recoveryservices.latest.ProtectionPolicy(namePolicy, {
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
    createRSV,createDefaultPolicyBkp,createBackupVm
}