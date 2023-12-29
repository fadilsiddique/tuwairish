import frappe

@frappe.whitelist()
def get_selling_price(item_code,customer):
    invoice_exists=frappe.db.exists('Sales Invoice',{'customer':customer})
    message=None
    if invoice_exists:
        last_invoice = frappe.get_last_doc('Sales Invoice', filters={"customer": customer,"docstatus":1})
        if last_invoice:
            for item in last_invoice.items:
                if item.item_code == item_code:
                    message = item.rate
    return message

@frappe.whitelist()
def get_buying_price(item_code,supplier):
    invoice_exists=frappe.db.exists('Purchase Invoice',{'supplier':supplier})
    message=None
    if invoice_exists:
        last_invoice = frappe.get_last_doc('Purchase Invoice', filters={"supplier": supplier,"docstatus":1})
        if last_invoice:
            for item in last_invoice.items:
                if item.item_code == item_code:
                    message = item.rate
    return message
    