import frappe
from frappe import _

def execute(filters=None):
    columns = get_sales_columns()
    data = get_sales_data(filters)
    return columns, data

def get_sales_columns():
    return [
        _("Sales Invoice") + ":Link/Sales Invoice:120",
        _("Posting Date") + ":Date:90",
        _("Customer") + ":Link/Customer:120",
        _("Customer Group") + ":Link/Customer Group:120",
        _("Grand Total") + ":Currency/currency:120",
        # Add more columns as needed
    ]

def get_sales_data(filters):
    conditions, values = get_sales_conditions(filters)

    query = """
        SELECT
            si.name as sales_invoice,
            si.posting_date as posting_date,
            si.customer as customer,
            cu.customer_group as customer_group,
            si.grand_total as grand_total
            # Add more fields as needed
        FROM
            `tabSales Invoice` si
        JOIN
            `tabCustomer` cu ON si.customer = cu.name
        WHERE
            si.docstatus != 2 {conditions}
    """.format(conditions=conditions)

    data = frappe.db.sql(query, values, as_dict=1)

    return data

def get_sales_conditions(filters):
    conditions = ""
    values = {}

    if filters.get("customer_group"):
        conditions += " AND cu.customer_group = %(customer_group)s"
        values["customer_group"] = filters["customer_group"]

    if filters.get("posting_date"):
        conditions += " AND si.posting_date = %(posting_date)s"
        values["posting_date"] = filters["posting_date"]

    # Add more conditions as needed

    return conditions, values
