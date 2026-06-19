import { useEffect, useState } from "react";
import API from "../../api";
import "./GSTReports.css";

export default function GSTReports() {
  const currentDate = new Date();

  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [gstr1Data, setGstr1Data] = useState([]);

  const [summary, setSummary] = useState({
    totalTaxableSales: 0,
    gstCollected: 0,
    gstPaid: 0,
    inputTaxCredit: 0,
    netGstLiability: 0,
    notes: "",
  });

  const fetchGSTR3B = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/gst-reports/gstr3b?month=${month}&year=${year}`,
      );

      setSummary({
        totalTaxableSales: res.data.totalTaxableSales || 0,
        gstCollected: res.data.gstCollected || 0,
        gstPaid: res.data.gstPaid || 0,
        inputTaxCredit: res.data.inputTaxCredit || 0,
        netGstLiability: res.data.netGstLiability || 0,
        notes: res.data.notes || "",
      });
    } catch (error) {
      console.error("GST Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGSTR1 = async () => {
    try {
      const res = await API.get(
        `/gst-reports/gstr1?from=${fromDate}&to=${toDate}`,
      );

      setGstr1Data(res.data || []);
    } catch (error) {
      console.error("GSTR1 Error:", error);
    }
  };

  const saveLedger = async () => {
    try {
      setLoading(true);

      await API.post("/gst-reports/gstr3b/ledger", {
        month,
        year,
        gstPaid: Number(summary.gstPaid),
        inputTaxCredit: Number(summary.inputTaxCredit),
        notes: summary.notes,
      });

      alert("GST Ledger Saved Successfully");

      fetchGSTR3B();
    } catch (error) {
      console.error(error);
      alert("Failed to save GST Ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGSTR3B();
  }, [month, year]);

  return (
    <div className="gst-page">
      {/* Header */}
      <div className="gst-header">
        <h1>GST Reports</h1>
      </div>

      {/* GSTR-1 */}
      <div className="gst-ledger">
        <h3>GSTR-1 - Outward Supplies</h3>

        <div className="gst-grid">
          <div className="gst-field">
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="gst-field">
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="gst-field">
            <label>&nbsp;</label>
            <button className="gst-save-btn" onClick={fetchGSTR1}>
              Load GSTR-1
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table className="gst-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Invoice Date</th>
                <th>Customer GSTIN</th>
                <th>Customer Name</th>
                <th>Place of Supply</th>
                <th>HSN Code</th>
                <th>Taxable Value</th>
                <th>GST Rate</th>
                <th>CGST Amount</th>
                <th>SGST Amount</th>
                <th>IGST Amount</th>
              </tr>
            </thead>

            <tbody>
              {gstr1Data.length > 0 ? (
                gstr1Data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.invoiceNumber}</td>
                    <td>{row.invoiceDate}</td>
                    <td>{row.customerGSTIN}</td>
                    <td>{row.customerName}</td>
                    <td>{row.placeOfSupply}</td>
                    <td>{row.hsnCode}</td>
                    <td>₹{Number(row.taxableValue).toLocaleString()}</td>
                    <td>{row.gstRate}%</td>
                    <td>₹{Number(row.cgstAmount).toLocaleString()}</td>
                    <td>₹{Number(row.sgstAmount).toLocaleString()}</td>
                    <td>₹{Number(row.igstAmount).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="gst-header">
        <h1>GSTR-3B Monthly GST Summary</h1>
      </div>

      {/* Filters */}
      <div className="gst-filters">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          placeholder="Year"
        />

        <button className="gst-btn" onClick={fetchGSTR3B}>
          Refresh
        </button>
      </div>
      {/* Summary Cards */}
      <div className="gst-cards">
        <div className="gst-card">
          <span>Total Taxable Sales</span>
          <h2>₹{Number(summary.totalTaxableSales).toLocaleString()}</h2>
        </div>

        <div className="gst-card">
          <span>GST Collected</span>
          <h2>₹{Number(summary.gstCollected).toLocaleString()}</h2>
        </div>

        <div className="gst-card">
          <span>GST Paid</span>
          <h2>₹{Number(summary.gstPaid).toLocaleString()}</h2>
        </div>

        <div className="gst-card">
          <span>Input Tax Credit</span>
          <h2>₹{Number(summary.inputTaxCredit).toLocaleString()}</h2>
        </div>

        <div className="gst-card">
          <span>Net GST Liability</span>

          <h2
            className={
              Number(summary.netGstLiability) > 0
                ? "gst-liability-positive"
                : "gst-liability-zero"
            }
          >
            ₹{Number(summary.netGstLiability).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Ledger Entry */}
      <div className="gst-ledger">
        <h3>GST Ledger Entry</h3>

        <div className="gst-grid">
          <div className="gst-field">
            <label>GST Paid</label>

            <input
              type="number"
              value={summary.gstPaid}
              onChange={(e) =>
                setSummary({
                  ...summary,
                  gstPaid: e.target.value,
                })
              }
            />
          </div>

          <div className="gst-field">
            <label>Input Tax Credit</label>

            <input
              type="number"
              value={summary.inputTaxCredit}
              onChange={(e) =>
                setSummary({
                  ...summary,
                  inputTaxCredit: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="gst-notes">
          <div className="gst-field">
            <label>Notes</label>

            <textarea
              rows="4"
              value={summary.notes}
              onChange={(e) =>
                setSummary({
                  ...summary,
                  notes: e.target.value,
                })
              }
            />
          </div>
        </div>

        <button
          className="gst-save-btn"
          onClick={saveLedger}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save GST Ledger"}
        </button>
      </div>
    </div>
  );
}
