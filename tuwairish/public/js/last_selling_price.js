




frappe.ui.form.on('Sales Invoice Item', {

    item_code: function (frm, cdt, cdn) {
        var item = locals[cdt][cdn];
        if (item.item_code) {
            fetch_last_10_prices(frm, item.item_code, cdt, cdn);
        }
    },
    custom_amount_editable: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn]
        var rate = row.rate
        var qty = row.qty
        frappe.model.set_value(cdt, cdn, 'rate', row.custom_amount_editable / qty)
    },

    rate: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn]
        var qty = row.qty
        frappe.model.set_value(cdt, cdn, 'custom_amount_editable', row.rate * qty)
    },
    qty: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn]
        var rate = row.rate
        frappe.model.set_value(cdt, cdn, 'custom_amount_editable', rate * row.qty)
    }

});

function fetch_last_10_prices(frm, item_code, cdt, cdn) {
    frappe.call({
        method: "tuwairish.api.customer_selling_price",
        args: {
            customer: frm.doc.customer,
            item_code: item_code
        },
        callback: function (r) {
            // Check if response is not empty
            if (r.message && r.message.length > 0) {
                show_price_dialog(r.message);
            }

            // Set focus back to the item field after response
            add_new_row(frm, cdt, cdn);
        }
    });
}

function show_price_dialog(data, frm) {
    const dialog = new frappe.ui.Dialog({
        title: "Last 10 Selling Prices",
        fields: [{ fieldname: 'prices', fieldtype: 'HTML' }],
        primary_action_label: 'Close',
        primary_action: function () {
            dialog.hide();
        }
    });

    dialog.$wrapper.on('hidden.bs.modal', function () {
        add_new_row(frm);
    });

    dialog.fields_dict.prices.$wrapper.html(build_html_table_for_prices(data));
    dialog.show();
}


function build_html_table_for_prices(data) {
    let html_content = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Invoice No.</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    
                </tr>
            </thead>
            <tbody>`;

    data.forEach(d => {
        html_content += `
            <tr>
                <td>${d.date}</td>
                <td>${d.customer_name}</td>
                <td>${d.invoice_name}</td>
                <td>${d.rate}</td>
                <td>${d.qty}</td>
                
            </tr>`;
    });

    html_content += `</tbody></table>`;
    return html_content;
}

function add_new_row(frm) {
    frm.add_child('items'); // 'items' should be replaced with the actual fieldname of your child table
    frm.refresh_field('items');

    frappe.after_ajax(() => {
        $(`div[data-fieldname="item_code"] .grid-static-col[data-fieldtype="Link"] input[data-fieldname="item_code"]`).focus();
    });
}
2