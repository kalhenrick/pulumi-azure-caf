const azure_nextgen = require("@pulumi/azure-nextgen");

function createDiagSetting(uri,logWorkId,diagName,logsDef,metricsDef,stgID) {
     new azure_nextgen.insights.v20170501preview.DiagnosticSetting(diagName, {
        logAnalyticsDestinationType: "Dedicated",
        logs: logsDef,
        metrics: metricsDef,
        name: diagName,
        resourceUri: uri,
        storageAccountId: stgID,
        workspaceId: logWorkId,
    });
}


module.exports = {createDiagSetting}