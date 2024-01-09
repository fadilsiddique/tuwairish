# Import necessary Frappe modules
import frappe

@frappe.whitelist()
def customer_selling_price(customer, item_code):
    prices = frappe.db.sql("""
        SELECT
            si.customer_name,
            si.name AS invoice_name,
            si_item.rate,
            si.posting_date AS date,
            si_item.qty
        FROM
            `tabSales Invoice` si
        JOIN
            `tabSales Invoice Item` si_item ON si.name = si_item.parent
        WHERE
            si.customer = %(customer)s AND
            si_item.item_code = %(item_code)s AND
            si.docstatus IN (0, 1) AND
            si.is_return != 1
        ORDER BY
            si.posting_date DESC
        LIMIT 10
    """, {'customer': customer, 'item_code': item_code}, as_dict=1)

    if not prices:
        prices = frappe.db.sql("""
            SELECT
                si.customer_name,
                si.name AS invoice_name,
                si_item.rate,
                si.posting_date AS date,
                si_item.qty
            FROM
                `tabSales Invoice` si
            JOIN
                `tabSales Invoice Item` si_item ON si.name = si_item.parent
            WHERE
                si_item.item_code = %(item_code)s AND
                si.docstatus IN (0, 1) AND
                si.is_return != 1 AND
                si.customer != %(customer)s
            ORDER BY
                si.posting_date DESC
            LIMIT 10
        """, {'customer': customer, 'item_code': item_code}, as_dict=1)

    return prices

