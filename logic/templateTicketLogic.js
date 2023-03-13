const TemplateTicket = require("../entity/templateTicket");

module.exports = class TemplateTicketLogic {
    convertTreeListFromTemplateTicketList(templateTicketList) {

        if (!Array.isArray(templateTicketList)) {
            throw new Error("不正なテンプレートチケットリストです。");
        }
        if (templateTicketList.length < 1) {
            return [];
        }

        let resultList = [];
        for (let i = 0; i < templateTicketList.length; i++) {
            resultList.push(new TemplateTicket(
                templateTicketList[i].id,
                templateTicketList[i].name,
                null,
                null,
                templateTicketList[i].content,
                true,
                templateTicketList[i].parent_issue_id,
                templateTicketList[i].tracker_id,
                templateTicketList[i].category_id,
                templateTicketList
            ));
        }
        return resultList;
    }
}
