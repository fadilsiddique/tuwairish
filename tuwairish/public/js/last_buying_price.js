frappe.ui.form.on('Purchase Invoice', {
	refresh(frm) {
		// your code here
	},
	
	before_save:function(frm){
	    console.log(frm.doc.total_taxes_and_charges)
	    if (frm.doc.total_taxes_and_charges){
	        frm.set_value('recoverable_standard_rated_expenses',frm.doc.total_taxes_and_charges)
	        frm.refresh_field('recoverable_standard_rated_expenses');
	    }
	}
})

frappe.ui.form.on('Purchase Invoice Item', {
    refresh(frm) {
        // your code here
    },
    item_code: function (frm, cdt, cdn) {
        let child = locals[cdt][cdn];
        console.log(child.item_code)
        
        if (child.item_code=='FUEL'){
            frappe.model.set_value(cdt,cdn,'expense_account','Vehicle Expenses - TTC')
            frm.refresh_field('expense_account')
        }
        

        frappe.call({
            method: "tuwairish.api.get_buying_price",
            args: {
                "item_code": child.item_code,
                "supplier": frm.doc.supplier
            }
        })
            .then(r => {
                console.log(r.message);
                // Delay execution of set_value by 0.5 seconds
                if(r.message !=null){
                    setTimeout(function () {
                    frappe.model.set_value(cdt, cdn, 'rate', r.message);
                }, 500);
                }

            });
    }
});