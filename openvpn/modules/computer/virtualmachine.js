const azure_nextgen = require("@pulumi/azure-nextgen");
const {createDiagSetting} = require('../../../root/modules/insights/diagnostic');
const {createBackupVm} = require('../../../storage/modules/recoveryservices/vault');


async function createPip(name,env,rg,diag,diagPIP,azureProvider) {
    const publicIPAddress = await new azure_nextgen.network.latest.PublicIPAddress(`pip-${name}-${rg.location}-001`, {
        dnsSettings: {
            domainNameLabel: `pip-${name}-${env}-${rg.location}`,
        },
        location: rg.location,
        publicIpAddressName: `pip-${name}-${env}-${rg.location}-001`,
        resourceGroupName: rg.name,
        publicIPAllocationMethod : 'Static',
        tags : {
            name:`pip-${name}-${env}-${rg.location}-001`,
            environment: env
        }
    },{provider: azureProvider}); 

    await createDiagSetting(publicIPAddress.id,diag.id,`diag-pip-${name}-${rg.location}-001`,diagPIP.log,diagPIP.metric,null,azureProvider)

    return publicIPAddress;
}

async function createNic(name,env,rg,pip,subnet,diag,diagNIC,azureProvider) {
    const networkInterface = await new azure_nextgen.network.latest.NetworkInterface(`nic-${name}-${env}-001`, {
        enableAcceleratedNetworking: false,        
        ipConfigurations: [{
            name: `ip-${name}-${env}-001`,            
            publicIPAddress: {
                id: pip ? pip.id : null,
            },
            subnet: {
                id: subnet.id,
            },
        }],
        location: rg.location,
        networkInterfaceName: `nic-${name}-${env}-001`,
        resourceGroupName: rg.name,
        tags : {
            name: `nic-${name}-${env}-001`,
            environment: env
        }
    },{provider: azureProvider});

    await createDiagSetting(networkInterface.id,diag.id,`diag-nic-${name}-${env}-001`,null,diagNIC.metric,null,azureProvider)

    return networkInterface;
}

async function createVMExtension(vm,rg,env,ext,azureProvider){

    let buff = new Buffer(ext);
    let base64data = buff.toString('base64');


    const extension = await new azure_nextgen.compute.latest.VirtualMachineExtension(`extension-${vm}-${env}`,{
        publisher : 'Microsoft.Azure.Extensions',
        typeHandlerVersion: '2.0',
        settings: {
            script : base64data
        },
        location: rg.location,
        resourceGroupName: rg.name,
        vmName: vm,
        type: 'CustomScript',
        vmExtensionName: `extension-${vm}-${env}`,
        tags: {
            name: `extension-${vm}-${env}`,
            environment: env

        }
    },{provider: azureProvider});
}


async function createVM(vmDefinitions,rg,stg,diagPIP,diagNIC,sshInfo,subnet,env,diag,azureProvider,extension,rsv,policyBackup,azureProviderOld) {
    let pip = null;

    if(vmDefinitions.publicIp)
        pip = await createPip(vmDefinitions.vmName,env,rg,diag,diagPIP,azureProvider);

    const nic = await  createNic(vmDefinitions.vmName,env,rg,pip,subnet,diag,diagNIC,azureProvider);

    const virtualMachine = await new azure_nextgen.compute.latest.VirtualMachine(`vm${vmDefinitions.computerName}${env}`, {
        priority: vmDefinitions.priority,
        hardwareProfile: {
            vmSize: vmDefinitions.vmSize,
        },
        diagnosticsProfile: {
            bootDiagnostics: {
                enabled: true,
                storageUri: stg.uri,
            },
        },
        location: rg.location,
        networkProfile: {
            networkInterfaces: [{
                id: nic.id,
                primary: true,
            }],
        },
        osProfile: {
            adminUsername: vmDefinitions.adminUsername,
            computerName: `vm${vmDefinitions.computerName}${env}`,
            linuxConfiguration: {
                disablePasswordAuthentication: true,
                ssh: {
                    publicKeys: [{
                        keyData: sshInfo.data,
                        path: `/home/${vmDefinitions.adminUsername}/.ssh/authorized_keys`,                
                    }],
                },
            },
        },
        resourceGroupName: rg.name,
        storageProfile: {
            imageReference: {
                offer: vmDefinitions.imgOffer,
                publisher: vmDefinitions.imgPublisher,
                sku: vmDefinitions.imgSku,
                version: vmDefinitions.imgVersion
            },
            osDisk: {
                caching: vmDefinitions.diskCaching,
                createOption: vmDefinitions.diskCreateOption,
                managedDisk: {
                    storageAccountType: vmDefinitions.diskStorageAccountType,
                },
                name: `disk${vmDefinitions.diskName}${env}`,
            },
        },
        vmName: `vm${vmDefinitions.vmName}${env}`,
        tags : {
            name: `vm${vmDefinitions.vmName}${env}`,
            environment: env
        }
    },{provider: azureProvider});    

    if(vmDefinitions.extension)
    createVMExtension(`vm${vmDefinitions.vmName}${env}`,rg,env,extension,azureProvider);

    if(vmDefinitions.backupVm)
    createBackupVm(rsv.name,rg,policyBackup,virtualMachine.id,`vm${vmDefinitions.vmName}${env}`,azureProviderOld)

    return virtualMachine;
}



module.exports = {
    createVM
}