const azure_nextgen = require("@pulumi/azure-nextgen");
const {getAzureProvider} = require('./modules/auth/login');
const config = require('./config/main');
const {createVM} = require('./modules/computer/virtualmachine');

async function createResources()  {

    //Create Provider using Service Principal
    const azureProvider = await getAzureProvider(config.orgpulumi,config.environment);
    
    //Get Resource Grpup Environment
     const resourceGroup = await  azure_nextgen.resources.latest.getResourceGroup({resourceGroupName: `rg-${config.environment}-${config.location}-001`},{provider:azureProvider});    
    
    // //Get Log Workspace
     const workspace = await azure_nextgen.operationalinsights.v20200801.getWorkspace({resourceGroupName: resourceGroup.name,workspaceName:`logw-${config.environment}-default-001`},{provider:azureProvider});
    
    // //Get Subnet
     const subnet = await azure_nextgen.network.latest.getSubnet({resourceGroupName: resourceGroup.name,virtualNetworkName: `vnet-${config.environment}-${config.location}-001`,subnetName:`snet-private-${config.environment}-${resourceGroup.location}-001`},{provider:azureProvider})

    // //Get Storage Account
     const stgdiag = await azure_nextgen.storage.latest.getStorageAccount({accountName: `stbootdiag${config.organization}${config.environment}`,resourceGroupName: resourceGroup.name},{provider: azureProvider});

     const stgeneral = await azure_nextgen.storage.latest.getStorageAccount({accountName: `stgeneral${config.organization}${config.environment}`,resourceGroupName: resourceGroup.name},{provider: azureProvider});

    // Create Container Openvpn
     const container = await new azure_nextgen.storage.latest.BlobContainer('openvpn',{accountName: stgeneral.name, resourceGroupName: resourceGroup.name, containerName: 'openvpn'},{provider: azureProvider});

    // Get Account Key
    const stgKeys = await azure_nextgen.storage.latest.listStorageAccountKeys({accountName: `stgeneral${config.organization}${config.environment}`, resourceGroupName: resourceGroup.name},{provider: azureProvider});


    let stgKey = stgKeys.keys[0].value;
    let stgName = stgeneral.name;
    let org = config.organization;

    let extension = config.extension.replace(/\$\{stg_key\}/gi,stgKey).replace(/\$\{stg_name}/gi,stgName).replace(/\$\{organization}/gi,org);

    await createVM(config.vmOpenVpn,resourceGroup,stgdiag,config.diagPIP,config.diagNIC,config.sshInfo,subnet,config.environment,workspace,azureProvider,extension)

    }   

    module.exports = { vm : createResources() };
