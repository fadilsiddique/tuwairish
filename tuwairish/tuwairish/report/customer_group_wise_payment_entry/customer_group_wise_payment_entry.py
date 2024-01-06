# Script Report: Payment Entry by Customer Group
import frappe
from frappe import _

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        _("Payment Entry") + ":Link/Payment Entry:120",
        _("Posting Date") + ":Date:90",
        _("Party") + ":Link/Customer:120",
        _("Customer Group") + ":Link/Customer Group:120",
        _("Amount") + ":Currency/currency:120",
        _("Mode of Payment") + ":Data:120",
    ]

def get_data(filters):
    conditions, values = get_conditions(filters)

    query = """
        SELECT
            pe.name as payment_entry,
            pe.posting_date as posting_date,
            pe.party as party,
            cu.customer_group as customer_group,
            pe.paid_amount as amount,
            pe.mode_of_payment as mode_of_payment
        FROM
            `tabPayment Entry` pe
        JOIN
            `tabCustomer` cu ON pe.party = cu.name
        WHERE
            pe.docstatus = 1 {conditions}
    """.format(conditions=conditions)

    data = frappe.db.sql(query, values, as_dict=1)

    return data

def get_conditions(filters):
    conditions = ""
    values = {}

    if filters.get("customer_group"):
        conditions += " AND cu.customer_group = %(customer_group)s"
        values["customer_group"] = filters["customer_group"]

    if filters.get("posting_date"):
        conditions += " AND pe.posting_date = %(posting_date)s"
        values["posting_date"] = filters["posting_date"]

    return conditions, values
