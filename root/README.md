[![Deploy](https://get.pulumi.com/new/button.svg)](https://app.pulumi.com/new)

# Create  Core Resources

Create basic resources for Azure Cloud Adoption Framework

## Running stack root

1.  Create a new stack:

```
$ pulumi stack init [<org-name>/]root 
```

2.  Set configurations

```
$ pulumi config set <project_name>:<variable> value 
```

3. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step):

```
$ az login 
```

4.  Restore NPM dependencies:

```
$ npm install
```

5.  Run `pulumi up` to preview and deploy changes:

```
$ pulumi up
```


## Configurations


| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
|subscription| Azure Subscription| string| none| yes|
|location| Azure Region for create resources| string| eastus| yes|
|seed| Seed to generate the initial password and prevent exchange during the first run of the stack mulitples times| string| none| yes|
|retention| Log Analytics Workspace retention in days| number| 30| yes|
|organization| Organzation owner of subscription| string| none| yes|
|environment| Azure environment| string| public| yes|
|domain| Azure Activy Directory domain| string| none| yes|
|budget| Budget value for alert| number| none| yes|


## Outputs


| Name | Description | 
|------|-------------|
|Service Princpal ID| Service Principal per environment  for use in Azure CLI|
|Service Principal Password| Service Principal password per environment  for use in Azure CLI |
|User email| User email per environment  for access Azure Portal|
|User password| Password user per environment for access Azure Protal|



## Resources Create
```
    Type                                        Name                                        Operation
+   azuread:index:Application                   app-master-prod                             create
+   azuread:index:Application                   app-master-mgmt                             create
+   azuread:index:Application                   app-master-nonprod                          create
+   azure:policy:Assignment                     SecStgEnabled                               create
+   azure:policy:Assignment                     BkpEnabledVM                                create
+   azure:policy:Assignment                     NWShouldEnabled                             create
+   azuread:index:Group                         gp-master-mgmt                              create
+   azuread:index:User                          usr-nonprod                                 create
+   azuread:index:Group                         gp-master-prod                              create
+   azure:policy:Assignment                     RDPInternetBlk                              create
+   azuread:index:Group                         gp-master-billing                           create
+   azure:policy:Assignment                     SSHInternetdBlk                             create
+   azuread:index:User                          usr-prod                                    create
+   azure:policy:Assignment                     InheritTagFromRG                            create
+   azure:policy:Assignment                     RequireTagOnRG                              create
+   azuread:index:User                          usr-mgmt                                    create
+   azure:policy:Assignment                     Allowedlocations                            create
+   azuread:index:User                          usr-billing                                 create
+   azure:policy:Assignment                     StgRestrictVnet                             create
+   azuread:index:Group                         gp-master-nonprod                           create
+   azuread:index:ServicePrincipal              sp-master-prod                              create
+   azuread:index:ServicePrincipal              sp-master-mgmt                              create
+   azuread:index:ServicePrincipal              sp-master-nonprod                           create
+   azure-nextgen:costmanagement:Budget         BudgetDefault                               create
+   azure-nextgen:resources:ResourceGroup       rg-nonprod-eastus-001                       create
+   azure-nextgen:authorization:RoleDefinition  rl-deny-view-billing                        create
+   azure-nextgen:resources:ResourceGroup       rg-prod-eastus-001                          create
+   azure-nextgen:resources:ResourceGroup       rg-mgmt-eastus-001                          create
+   azure-nextgen:authorization:RoleDefinition  rl-allow-view-billing                       create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-gp-prod-contributor             create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-gp-mgmt-contributor             create
+   azuread:index:GroupMember                   GroupMember-master-mgmt                     create
+   azuread:index:GroupMember                   GroupMember-master-nonprod                  create
+   azuread:index:GroupMember                   GroupMember-master-prod                     create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-gp-nonprod-contributor          create
+   azuread:index:GroupMember                   GroupMember-master-billing                  create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-rg-mgmt-contributor             create
+   azuread:index:ServicePrincipalPassword      sppw-master-nonprod                         create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-rg-prod-mgmt-net-contributor    create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-rg-nonprod-contributor          create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-rg-nonprod-mgmt-net-contributor create
+   azuread:index:ServicePrincipalPassword      sppw-master-mgmt                            create
+   azuread:index:ServicePrincipalPassword      sppw-master-prod                            create
+   azure-nextgen:authorization:RoleAssignment  roleAssigrl-rg-prod-contributor             create
+   azure-nextgen:operationalinsights:Workspace logw-mgmt-default-001                       create
+   azure-nextgen:authorization:RoleAssignment  roleAssigDennyBilling-prod                  create
+   azure-nextgen:authorization:RoleAssignment  roleAssigDennyBilling-mgmt                  create
+   azure-nextgen:operationalinsights:Workspace logw-nonprod-default-001                    create
+   azure-nextgen:authorization:RoleAssignment  roleAssigDennyBilling-nonprod               create
+   azure-nextgen:operationalinsights:Workspace logw-prod-default-001                       create
+   azure-nextgen:authorization:RoleAssignment  roleAssigAllowBilling-billing               create
+   azure-nextgen:insights:DiagnosticSetting    diagActivityLog                             create
```