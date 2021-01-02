const azure = require("@pulumi/azure");

 function allowViewBilling (subscription) 
   { 

    return new azure.authorization.RoleDefinition("rl-allow-billing", {
    scope: `/subscriptions/${subscription}`,
    assignableScopes: [`/subscriptions/${subscription}`],
    description: '',
    permissions : [            {
        "notActions": [],
        "actions": [
            "Microsoft.Billing/validateAddress/action",
            "Microsoft.Billing/register/action",
            "Microsoft.Billing/billingAccounts/read",
            "Microsoft.Billing/billingAccounts/listInvoiceSectionsWithCreateSubscriptionPermission/action",
            "Microsoft.Billing/billingAccounts/write",
            "Microsoft.Billing/billingAccounts/agreements/read",
            "Microsoft.Billing/billingAccounts/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/write",
            "Microsoft.Billing/billingAccounts/billingProfiles/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/customers/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/write",
            "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/download/action",
            "Microsoft.Billing/billingAccounts/billingRoleAssignments/write",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/read",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/move/action",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/validateMoveEligibility/action",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/downloadDocuments/action",
            "Microsoft.Billing/billingAccounts/customers/read",
            "Microsoft.Billing/billingAccounts/customers/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/departments/read",
            "Microsoft.Billing/billingAccounts/departments/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/departments/billingRoleAssignments/write",
            "Microsoft.Billing/billingAccounts/enrollmentAccounts/read",
            "Microsoft.Billing/billingAccounts/enrollmentAccounts/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/enrollmentAccounts/billingRoleAssignments/write",
            "Microsoft.Billing/billingAccounts/invoices/pricesheet/download/action",
            "Microsoft.Billing/billingAccounts/products/read",
            "Microsoft.Billing/billingAccounts/products/move/action",
            "Microsoft.Billing/billingAccounts/products/validateMoveEligibility/action",
            "Microsoft.Billing/billingProperty/read",
            "Microsoft.Billing/billingProperty/write",
            "Microsoft.Billing/departments/read",
            "Microsoft.Billing/invoices/download/action",
            "Microsoft.Billing/operations/read"
        ]
    }]

});
}

 function denyViewBilling(subscription) {
    return  new azure.authorization.RoleDefinition("rl-deny-billing", {
    scope: `/subscriptions/${subscription}`,
    assignableScopes: [`/subscriptions/${subscription}`],
    description: '',
    permissions : [            {
        "actions": [],
        "notActions": [
            "Microsoft.Billing/validateAddress/action",
            "Microsoft.Billing/register/action",
            "Microsoft.Billing/billingAccounts/read",
            "Microsoft.Billing/billingAccounts/listInvoiceSectionsWithCreateSubscriptionPermission/action",
            "Microsoft.Billing/billingAccounts/write",
            "Microsoft.Billing/billingAccounts/agreements/read",
            "Microsoft.Billing/billingAccounts/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/write",
            "Microsoft.Billing/billingAccounts/billingProfiles/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/customers/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/write",
            "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/download/action",
            "Microsoft.Billing/billingAccounts/billingRoleAssignments/write",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/read",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/move/action",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/validateMoveEligibility/action",
            "Microsoft.Billing/billingAccounts/billingSubscriptions/downloadDocuments/action",
            "Microsoft.Billing/billingAccounts/customers/read",
            "Microsoft.Billing/billingAccounts/customers/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/departments/read",
            "Microsoft.Billing/billingAccounts/departments/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/departments/billingRoleAssignments/write",
            "Microsoft.Billing/billingAccounts/enrollmentAccounts/read",
            "Microsoft.Billing/billingAccounts/enrollmentAccounts/billingPermissions/read",
            "Microsoft.Billing/billingAccounts/enrollmentAccounts/billingRoleAssignments/write",
            "Microsoft.Billing/billingAccounts/invoices/pricesheet/download/action",
            "Microsoft.Billing/billingAccounts/products/read",
            "Microsoft.Billing/billingAccounts/products/move/action",
            "Microsoft.Billing/billingAccounts/products/validateMoveEligibility/action",
            "Microsoft.Billing/billingProperty/read",
            "Microsoft.Billing/billingProperty/write",
            "Microsoft.Billing/departments/read",
            "Microsoft.Billing/invoices/download/action",
            "Microsoft.Billing/operations/read"
        ]
    }]

});
}

module.exports = {
    allowViewBilling, denyViewBilling
}