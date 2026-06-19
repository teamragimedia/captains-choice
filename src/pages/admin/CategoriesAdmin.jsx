import { useEffect, useState } from "react";

import API from "../../api";

import "./Categories.css";

function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");

  const [icon, setIcon] = useState("");

  const [color, setColor] = useState("#0a3cff");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ================= FETCH CATEGORIES =================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");

      setCategories(res.data);
    } catch (err) {
      console.log(err);

      showPopup("Failed to load categories", "error");
    }
  };

  // ================= SHOW POPUP =================

  const showPopup = (message, type = "success") => {
    setPopup({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setPopup({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };

  // ================= ADD CATEGORY =================

  const addCategory = async () => {
    try {
      if (!name || !icon || !color) {
        showPopup("Please fill all fields", "error");

        return;
      }

      setLoading(true);

      const newCategory = {
        name,
        icon,
        color,
        status: "active",
      };

      const res = await API.post("/categories", newCategory);

      // ADD TO UI INSTANTLY
      setCategories([
        ...categories,
        {
          id: Date.now(),
          ...newCategory,
        },
      ]);

      // CLEAR FORM
      setName("");
      setIcon("");
      setColor("#0a3cff");

      showPopup("Category added successfully");
    } catch (err) {
      console.log(err);

      showPopup("Failed to add category", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE CATEGORY =================

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);

      setCategories(categories.filter((c) => c.id !== id));

      showPopup("Category deleted successfully");
    } catch (err) {
      console.log(err);

      showPopup("Delete failed", "error");
    }
  };

  // ================= TOGGLE STATUS =================

  const toggleStatus = async (id) => {
    try {
      await API.put(`/categories/toggle/${id}`);

      const updated = categories.map((cat) => {
        if (cat.id === id) {
          return {
            ...cat,
            status: cat.status === "active" ? "inactive" : "active",
          };
        }

        return cat;
      });

      setCategories(updated);

      showPopup("Status updated");
    } catch (err) {
      console.log(err);

      showPopup("Status update failed", "error");
    }
  };

  // ================= SEARCH =================

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="category-page">
      {/* ================= POPUP ================= */}

      {popup.show && (
        <div className={`popup ${popup.type}`}>{popup.message}</div>
      )}

      {/* ================= HEADER ================= */}

      <div className="header">
        <h2>Category Management</h2>

        <p>Manage all product categories in one place</p>
      </div>

      {/* ================= ADD CATEGORY ================= */}

      <div className="card">
        <h3>Add New Category</h3>

        <div className="form-row">
          {/* NAME */}

          <div className="input-group">
            <label>Name</label>

            <input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* ICON */}

          <div className="input-group">
            <label>Icon</label>

            <input
              placeholder="🍕"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>

          {/* COLOR */}

          <div className="input-group color-group">
            <label>Color</label>

            <div className="color-input">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />

              <span>{color}</span>
            </div>
          </div>

          {/* BUTTON */}

          <button className="add-btn" onClick={addCategory} disabled={loading}>
            {loading ? "Adding..." : "+ Add"}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="card">
        <div className="table-header">
          <h3>All Categories</h3>

          <input
            className="search"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>

              <th>Name</th>

              <th>Icon</th>

              <th>Color</th>

              <th>Status</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>

                <td>{cat.name}</td>

                <td className="icon">{cat.icon}</td>

                {/* COLOR */}

                <td className="color-cell">
                  <div
                    className="color-box"
                    style={{
                      background: cat.color,
                    }}
                  />

                  <span>{cat.color}</span>
                </td>

                {/* STATUS */}

                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={cat.status !== "inactive"}
                      onChange={() => toggleStatus(cat.id)}
                    />

                    <span className="slider"></span>
                  </label>
                </td>

                {/* ACTIONS */}

                <td className="actions">
                  <button className="edit-btn">Edit</button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoriesAdmin;
