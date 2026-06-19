import React, { useEffect, useState } from "react";

import { FiEdit, FiTrash2, FiStar } from "react-icons/fi";
import "../../styles/Addresses.css";
import API from "../../api";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address_line: "",
    city: "",
    pincode: "",
    phone: "",
    type: "billing",
  });

  const customerId = localStorage.getItem("customerId");

  const fetchAddresses = () => {
    API.get("/addresses/my", {
      headers: { customerid: customerId },
    }).then((res) => setAddresses(res.data));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = () => {
    if (editData) {
      // UPDATE
      API.put(`/addresses/${editData.id}`, form).then(() => {
        setShowForm(false);
        setEditData(null);
        fetchAddresses();
      });
    } else {
      // CREATE
      API.post("/addresses/create", form, {
        headers: { customerid: customerId },
      }).then(() => {
        setShowForm(false);
        fetchAddresses();
      });
    }
  };

  /* ================= ACTIONS ================= */
  const setPrimary = (id) => {
    API.put(
      `/addresses/set-primary/${id}`,
      {},
      { headers: { customerid: customerId } },
    ).then(fetchAddresses);
  };

  const deleteAddress = (id) => {
    API.delete(`/addresses/${id}`).then(fetchAddresses);
  };

  const openEdit = (addr) => {
    setEditData(addr);
    setForm(addr);
    setShowForm(true);
  };

  return (
    <div className="addresses-container">
      {/* HEADER */}
      <div className="addresses-header">
        <h2>Addresses</h2>
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(true);
            setEditData(null);
            setForm({
              name: "",
              address_line: "",
              city: "",
              pincode: "",
              phone: "",
              type: "billing",
            });
          }}
        >
          + Add New Address
        </button>
      </div>

      {/* LIST */}
      <div className="address-list">
        {addresses.map((addr) => (
          <div className="address-card" key={addr.id}>
            <div className="address-left">
              <div className="name-row">
                <h3>{addr.name}</h3>

                {addr.is_primary === 1 && (
                  <span className="primary-badge1">Primary</span>
                )}
              </div>

              <p className="type">{addr.type}</p>

              <p className="address-text">
                {addr.address_line}, {addr.city} {addr.pincode}
              </p>

              <p className="phone">📞 {addr.phone}</p>
            </div>

            <div className="address-actions">
              <FiStar
                onClick={() => setPrimary(addr.id)}
                className={addr.is_primary ? "icon star active" : "icon star"}
              />

              <FiEdit className="icon edit" onClick={() => openEdit(addr)} />

              <FiTrash2
                onClick={() => deleteAddress(addr.id)}
                className="icon delete"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================= POPUP FORM ================= */}
      {showForm && (
        <div className="modal">
          <div className="modal-box">
            <h3>{editData ? "Edit Address" : "Add Address"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Address"
              value={form.address_line}
              onChange={(e) =>
                setForm({ ...form, address_line: e.target.value })
              }
            />

            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleSubmit}>Save</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
