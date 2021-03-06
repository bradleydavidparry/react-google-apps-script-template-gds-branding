function doGet(e) {
    var template = HtmlService.createTemplateFromFile('index');

    var permissions = createPermissionsDict();

    var user = Session.getActiveUser().getEmail();

    if(user != "bradley.parry@digital.cabinet-office.gov.uk"){
        var sheet = SpreadsheetApp.openById(trackingSheetId).getSheetByName("UPDATE THIS");
        sheet.appendRow([user.replace("@digital.cabinet-office.gov.uk","").replace("."," "),new Date()]);
    }

    template.user = user;

    if(permissions[user]){
        return template.evaluate()
            .setTitle('Title')
            .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    }
}

function getData(){
    var db = objDB.open(invoicingId);
    
    const products = objDB.getRows( db, "Products");
    const departments = objDB.getRows( db, "Departments");
    const services = objDB.getRows( db, "Services");
    const pos = objDB.getRows( db, "POs");
    const invoices = objDB.getRows( db, "Invoices");
    const contacts = objDB.getRows( db, "Contacts");

    return JSON.stringify({products, departments, services, pos, invoices, contacts});
}

function createPermissionsDict(){
    var data = SpreadsheetApp.openById(invoicingId)
                             .getSheetByName("Permissions").getDataRange().getValues();
    var titles = data[0];
    var dict = {};
    for(var i = 1; i < data.length; i++){
        dict[data[i][0]] = {};
        for(var j = 1; j < titles.length; j++){
        dict[data[i][0]][titles[j]] = data[i][j];
        }
    }
    return dict;
}