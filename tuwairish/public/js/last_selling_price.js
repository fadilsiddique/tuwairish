frappe.ui.form.on('Sales Invoice', {
    refresh(frm) {
        // your code here
    }
})

frappe.ui.form.on('Sales Invoice Item', {
    refresh(frm) {
        // your code here
    },
    item_code: function (frm, cdt, cdn) {
        let child = locals[cdt][cdn];
        console.log(child.item_code)
        console.log(frm.doc.customer)

        frappe.call({
            method: "tuwairish.api.get_selling_price",
            args: {
                "item_code": child.item_code,
                "customer": frm.doc.customer
            }
        })
            .then(r => {
                console.log(r.message);

                // Delay execution of set_value by 0.5 seconds
                if (r.message != null) {
                    setTimeout(function () {
                        frappe.model.set_value(cdt, cdn, 'rate', r.message);
                    }, 500);
                }
            });
    }
});