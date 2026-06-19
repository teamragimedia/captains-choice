import { useEffect, useState } from "react";
import API from "../../api";
import "./Categories.css";

export default function PurchaseAdmin() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [purchase, setPurchase] = useState({
    supplier_id: "",
    invoice_number: "",
    purchase_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: 1,
      purchase_price: 0,
      gst_rate: 0,
      hsn_code: "",
    },
  ]);

  const [supplierForm, setSupplierForm] = useState({
    supplier_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    gst_number: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [supRes, prodRes] = await Promise.all([
        API.get("/suppliers"),
        API.get("/products"),
      ]);
      setSuppliers(supRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        product_id: "",
        quantity: 1,
        purchase_price: 0,
        gst_rate: 0,
        hsn_code: "",
      },
    ]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "product_id") {
      const product = products.find((p) => p.id === Number(value));
      if (product) {
        updated[index].gst_rate = product.gst_rate || 0;
        updated[index].hsn_code = product.hsn_code || "";
      }
    }

    setItems(updated);
  };

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const savePurchase = async () => {
    try {
      const payload = {
        ...purchase,
        items: items.map((item) => {
          const taxableValue =
            Number(item.quantity) * Number(item.purchase_price);
          const gstAmount = taxableValue * (Number(item.gst_rate) / 100);
          return {
            ...item,
            taxable_value: taxableValue,
            cgst_amount: gstAmount / 2,
            sgst_amount: gstAmount / 2,
            igst_amount: 0,
            total_price: taxableValue + gstAmount,
          };
        }),
      };

      const res = await API.post("/purchases", payload);
      alert(res.data.message);

      setPurchase({
        supplier_id: "",
        invoice_number: "",
        purchase_date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setItems([
        {
          product_id: "",
          quantity: 1,
          purchase_price: 0,
          gst_rate: 0,
          hsn_code: "",
        },
      ]);
    } catch (err) {
      console.log(err);
      alert("Purchase save failed");
    }
  };

  const saveSupplier = async () => {
    try {
      const res = await API.post("/suppliers", supplierForm);
      alert("Supplier Added");

      const supplierId = res.data.supplierId;
      const supplierRes = await API.get("/suppliers");
      setSuppliers(supplierRes.data);

      setPurchase({ ...purchase, supplier_id: supplierId });
      setSupplierForm({
        supplier_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        gst_number: "",
      });
      setShowSupplierModal(false);
    } catch (err) {
      console.log(err);
      alert("Failed to add supplier");
    }
  };

  const grandTotal = items.reduce((sum, item) => {
    const taxable = Number(item.quantity) * Number(item.purchase_price);
    const gst = taxable * (Number(item.gst_rate) / 100);
    return sum + taxable + gst;
  }, 0);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Purchase Entry</h2>
        <p>Create supplier purchases</p>
      </div>

      {/* Purchase Header Form */}
      <div className="admin-card">
        <div className="form-grid">
          {/* Supplier dropdown + Add New button */}
          <div className="input-group">
            <label>Supplier</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={purchase.supplier_id}
                onChange={(e) =>
                  setPurchase({ ...purchase, supplier_id: e.target.value })
                }
                style={{ flex: 1 }}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.supplier_name}
                  </option>
                ))}
              </select>
              <button
                className="primary-btn"
                onClick={() => setShowSupplierModal(true)}
              >
                + New
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Invoice Number</label>
            <input
              value={purchase.invoice_number}
              onChange={(e) =>
                setPurchase({ ...purchase, invoice_number: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Purchase Date</label>
            <input
              type="date"
              value={purchase.purchase_date}
              onChange={(e) =>
                setPurchase({ ...purchase, purchase_date: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Notes</label>
            <input
              value={purchase.notes}
              onChange={(e) =>
                setPurchase({ ...purchase, notes: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="admin-card">
        <h3>Purchase Items</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>GST %</th>
              <th>HSN</th>
              <th>Taxable</th>
              <th>Total (with GST)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const taxable =
                Number(item.quantity) * Number(item.purchase_price);
              const gst = taxable * (Number(item.gst_rate) / 100);
              const total = taxable + gst;

              return (
                <tr key={index}>
                  <td>
                    <select
                      value={item.product_id}
                      onChange={(e) =>
                        updateItem(index, "product_id", e.target.value)
                      }
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.purchase_price}
                      onChange={(e) =>
                        updateItem(index, "purchase_price", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.gst_rate}
                      onChange={(e) =>
                        updateItem(index, "gst_rate", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={item.hsn_code}
                      onChange={(e) =>
                        updateItem(index, "hsn_code", e.target.value)
                      }
                    />
                  </td>
                  <td>₹{taxable.toLocaleString()}</td>
                  <td>₹{total.toLocaleString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => removeRow(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} style={{ textAlign: "right", fontWeight: 600 }}>
                Grand Total
              </td>
              <td style={{ fontWeight: 600 }}>
                ₹{grandTotal.toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button className="primary-btn" onClick={addRow}>
            + Add Item
          </button>
          <button className="primary-btn" onClick={savePurchase}>
            Save Purchase
          </button>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Supplier</h3>
            <div className="form-grid">
              <input
                placeholder="Supplier Name"
                value={supplierForm.supplier_name}
                onChange={(e) =>
                  setSupplierForm({
                    ...supplierForm,
                    supplier_name: e.target.value,
                  })
                }
              />
              <input
                placeholder="Contact Person"
                value={supplierForm.contact_person}
                onChange={(e) =>
                  setSupplierForm({
                    ...supplierForm,
                    contact_person: e.target.value,
                  })
                }
              />
              <input
                placeholder="Phone"
                value={supplierForm.phone}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, phone: e.target.value })
                }
              />
              <input
                placeholder="Email"
                value={supplierForm.email}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, email: e.target.value })
                }
              />
              <input
                placeholder="GST Number"
                value={supplierForm.gst_number}
                onChange={(e) =>
                  setSupplierForm({
                    ...supplierForm,
                    gst_number: e.target.value,
                  })
                }
              />
              <input
                placeholder="Address"
                value={supplierForm.address}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, address: e.target.value })
                }
              />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="primary-btn" onClick={saveSupplier}>
                Save Supplier
              </button>
              <button
                className="delete-btn"
                onClick={() => setShowSupplierModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
