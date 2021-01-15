const azure_nextgen = require("@pulumi/azure-nextgen");
const moment = require('moment');

function createBudget(subscription,budgetAmount,alertEmails) {
    const budget = new azure_nextgen.consumption.latest.Budget('BudgetDefaultAlert', {
        amount: budgetAmount,
        budgetName: "BudgetDefault",
        category: "Cost",
        notifications: { 
            Actual_GreaterThan_90_Percent: {
                contactEmails: alertEmails,
                enabled: true,
                operator: "GreaterThan",
                threshold: 90,
            },
        },
        scope: `/subscriptions/${subscription}`,
        timeGrain: "Monthly",
        timePeriod: {
            endDate: '2099-01-01',
            startDate: `${moment().format('YYYY-MM')}-01`,

        },
    });
    return budget;

}

module.exports = {createBudget}