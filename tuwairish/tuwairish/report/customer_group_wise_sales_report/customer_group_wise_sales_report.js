// Copyright (c) 2024, Upscape Technologies and contributors
// For license information, please see license.txt

frappe.query_reports["Customer Group Wise Sales Report"] = {
	"filters": [

		        {
            "fieldname": "customer_group",
            "label": __("Customer Group"),
            "fieldtype": "Link",
            "options": "Customer Group",
            "get_query": function () {
                return {
                    "doctype": "Customer Group",
                    "filters": {
                        // You can add additional filters based on your requirement
                    }
                };
            }
        },
        {
            "fieldname": "posting_date",
            "label": __("Posting Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.get_today(),
            "reqd": 1
        }

	]
};
