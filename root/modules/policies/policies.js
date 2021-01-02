const pulumi = require("@pulumi/pulumi");
const config = new pulumi.Config();
const location = config.require('location');

const PoliciesDefs = [
      {
        name : 'Allowedlocations',
        id: '/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c',
        params: `{
            "listOfAllowedLocations": {
              "value": ["${location}"]
            }
          }`
        
    },
      {
        name : 'RequireTagOnRG',
        id: '/providers/Microsoft.Authorization/policyDefinitions/871b6d14-10aa-478d-b590-94f262ecfa99',
        params: `{
            "tagName": {
              "value": "name"
            }
          }`
    },
    //   {
    //     name : 'InheritTagFromRG',
    //     id: '/providers/Microsoft.Authorization/policyDefinitions/cd3aa116-8754-49c9-a813-ad46512ece54',
    //     params: `{
    //         "tagName": {
    //           "value": "environment"
    //         }
    //       }`
    // },
      {
        name : 'SecStgEnabled',
        id: '/providers/Microsoft.Authorization/policyDefinitions/404c3081-a854-4457-ae30-26a93ef643f9',
        params : `{
            "Effect": {
              "value": "Deny"
            }
          }`
    },
      {
        name : 'StgRestrictVnet',
        id: '/providers/Microsoft.Authorization/policyDefinitions/34c877ad-507e-4c82-993e-3452a6e0ad3c',
        params : `{
            "Effect": {
              "value": "Deny"
            }
          }`
    },
      {
        name : 'RDPInternetBlk',
        id: '/providers/Microsoft.Authorization/policyDefinitions/e372f825-a257-4fb8-9175-797a8a8627d6',
        params : `{
            "Effect": {
              "value": "Audit"
            }
          }`
    },
      {
        name : 'NWShouldEnabled',
        id: '/providers/Microsoft.Authorization/policyDefinitions/b6e2945c-0b7b-40f5-9233-7a5323b5cdc6',
        params: `{
            "listOfLocations": {
              "value": ["${location}"]
            }
          }`
    },
      {
        name : 'SSHInternetdBlk',
        id: '/providers/Microsoft.Authorization/policyDefinitions/2c89a2e5-7285-40fe-afe0-ae8654b92fab',
        params : `{
            "Effect": {
              "value": "Audit"
            }
          }`
    },
      {
        name : 'BkpEnabledVM',
        id: '/providers/Microsoft.Authorization/policyDefinitions/013e242c-8828-4970-87b3-ab247555486d',
        params : `{
            "Effect": {
              "value": "AuditIfNotExists"
            }
          }`
    },

]

module.exports = { PoliciesDefs }