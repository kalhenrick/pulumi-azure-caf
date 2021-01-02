const azure_nextgen = require("@pulumi/azure-nextgen");
const moment = require('moment');

function createBudget(subscription,budget) {
    new  azure_nextgen.costmanagement.v20190401preview.Budget('BudgetDefault',{
        amount : budget,
        budgetName: 'BudgetDefault',
        category: 'Cost',
        scope: `/subscriptions/${subscription}`,
        timeGrain:  'Monthly',
        timePeriod: {
            startDate: `${moment().format('YYYY-MM')}-01`,
            endDate: '2099-01-01'
        }
        
    });
}

module.exports = {createBudget}