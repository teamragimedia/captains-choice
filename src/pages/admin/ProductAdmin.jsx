import { useEffect, useState } from "react";
import "../../admin/Admin.css";
import API from "../../api";

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    weight: "",
    price: "",
    category: "",
    stock: "",
    sku: "",
    barcode: "",
    gst_rate: "5",
    hsn_code: "",
    image: "",
  });

  const PRODUCT_API = "/products";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [excelFile, setExcelFile] = useState(null);

  const getStockClass = (stock) => {
    if (stock > 50) return "green";
    if (stock > 20) return "orange";
    return "red";
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      weight: product.weight || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock || "",
      sku: product.sku || "",
      barcode: product.barcode || "",
      gst_rate: product.gst_rate || "5",
      hsn_code: product.hsn_code || "",
      image: "",
    });

    setEditId(product.id);
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get(PRODUCT_API);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await API.get("/products/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = "products.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to download Excel");
    }
  };

  const uploadExcel = async () => {
    try {
      if (!excelFile) {
        alert("Please select an Excel file");
        return;
      }

      const formData = new FormData();
      formData.append("excel", excelFile);

      const res = await API.post("/products/update-excel", formData);

      alert(`${res.data.updated} products updated successfully`);

      fetchProducts();
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      console.error(err.response?.data);

      alert(err.response?.data?.message || "Excel upload failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("weight", form.weight);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("sku", form.sku);
      formData.append("barcode", form.barcode);
      formData.append("gst_rate", form.gst_rate);
      formData.append("hsn_code", form.hsn_code);

      if (form.image) {
        formData.append("image", form.image);
      }

      await API.post(PRODUCT_API, formData);

      alert("Product added successfully");

      setForm({
        name: "",
        weight: "",
        price: "",
        category: "",
        stock: "",
        sku: "",
        barcode: "",
        gst_rate: "5",
        hsn_code: "",
        image: "",
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  const updateProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("weight", form.weight);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("sku", form.sku);
      formData.append("barcode", form.barcode);
      formData.append("gst_rate", form.gst_rate);
      formData.append("hsn_code", form.hsn_code);

      if (form.image) {
        formData.append("image", form.image);
      }

      await API.put(`${PRODUCT_API}/${editId}`, formData);

      alert("Product updated successfully");

      setEditId(null);

      setForm({
        name: "",
        weight: "",
        price: "",
        category: "",
        stock: "",
        sku: "",
        barcode: "",
        gst_rate: "5",
        hsn_code: "",
        image: "",
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`${PRODUCT_API}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  const filteredProducts = products
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "price" || sortBy === "stock") {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = valA?.toString().toLowerCase();
        valB = valB?.toString().toLowerCase();
      }

      if (valA === valB) return 0;

      return order === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });

  return (
    <div className="admin-page product-page">
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h2>Product Management</h2>
          <p>Manage all your products in one place</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button className="primary-btn" onClick={downloadExcel}>
            📥 Download Excel
          </button>

          <input
            type="file"
            accept=".xlsx,.xls"
            className="text-black"
            onChange={(e) => setExcelFile(e.target.files[0])}
          />

          <button className="primary-btn text-black" onClick={uploadExcel}>
            📤 Upload Excel
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h3>{editId ? "Edit Product" : "Add New Product"}</h3>

        <div className="form-grid">
          <div className="input-group">
            <label>Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
            />
          </div>

          <div className="input-group">
            <label>Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
            />
          </div>

          <div className="input-group">
            <label>Weight</label>
            <input
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="Weight"
            />
          </div>

          <div className="input-group">
            <label>Price</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
            />
          </div>

          <div className="input-group">
            <label>Stock</label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
            />
          </div>

          <div className="input-group">
            <label>SKU</label>

            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="SKU"
            />
          </div>

          <div className="input-group">
            <label>Barcode</label>

            <input
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="Barcode"
            />
          </div>

          <div className="input-group">
            <label>GST Rate</label>

            <select
              name="gst_rate"
              value={form.gst_rate}
              onChange={handleChange}
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>

          <div className="input-group">
            <label>HSN Code</label>

            <input
              name="hsn_code"
              value={form.hsn_code}
              onChange={handleChange}
              placeholder="HSN Code"
            />
          </div>

          <div className="input-group">
            <label>Image</label>
            <input
              type="file"
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files[0],
                })
              }
            />
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={editId ? updateProduct : addProduct}
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="admin-card">
        <h3>All Products</h3>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>

          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Barcode</th>
              <th>HSN Code</th>
              <th>GST</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>

                <td>{p.name}</td>

                <td>₹{p.price}</td>

                <td>
                  <span className={`stock ${getStockClass(Number(p.stock))}`}>
                    {p.stock}
                  </span>
                </td>

                <td>{p.category}</td>

                <td>{p.sku}</td>

                <td>{p.barcode}</td>

                <td>{p.hsn_code}</td>

                <td>{p.gst_rate}%</td>

                <td style={{ textAlign: "center" }}>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(p)}>
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductAdmin;
