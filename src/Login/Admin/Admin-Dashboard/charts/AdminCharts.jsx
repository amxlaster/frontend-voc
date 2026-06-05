import React, { useEffect, useRef, useState } from "react";
import API from "../../../../lib/api";
import { Pie, Bar, Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import "./AdminCharts.css";

/* 🔥 REGISTER CHART ELEMENTS */
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminCharts() {
  const [type, setType] = useState("bar");
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔥 EXPORT REFS */
  const pieRef = useRef();
  const barRef = useRef();
  const lineRef = useRef();

  /* 🔥 RESPONSIVE CHART OPTIONS */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  /* ---------------- LOAD DATA ---------------- */
  const loadData = () => {
    setLoading(true);
    setData(null);

    API.get("/leaderboard/charts", {
      params: {
        from: from || undefined,
        to: to || undefined,
      },
    })
      .then((res) => {
        if (!res.data || !res.data.dates || res.data.dates.length === 0) {
          setData({ empty: true });
        } else {
          setData(res.data);
        }
      })
      .catch(() => setData({ empty: true }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="chart-loading">Loading charts…</div>;
  }

  if (data?.empty) {
    return (
      <div className="admin-charts-root">
        <h2>Learning Analytics</h2>
        <div className="chart-loading">
          No quiz data available for selected date range
        </div>
      </div>
    );
  }

  if (!data) return <div className="chart-loading">Loading charts…</div>;

  /* ---------------- PIE DATA ---------------- */
  const pieData = {
    labels: ["Beginner", "Intermediate", "Advanced"],
    datasets: [
      {
        data: [
          data.totals.beginner,
          data.totals.intermediate,
          data.totals.advanced,
        ],
        backgroundColor: ["#4e73df", "#f6c23e", "#1cc88a"],
      },
    ],
  };

  /* ---------------- BAR / LINE DATA ---------------- */
  const progressData = {
    labels: data.dates,
    datasets: [
      {
        label: "Beginner",
        data: data.beginner,
        backgroundColor: "#4e73df",
        borderColor: "#4e73df",
      },
      {
        label: "Intermediate",
        data: data.intermediate,
        backgroundColor: "#f6c23e",
        borderColor: "#f6c23e",
      },
      {
        label: "Advanced",
        data: data.advanced,
        backgroundColor: "#1cc88a",
        borderColor: "#1cc88a",
      },
    ],
  };

  /* ---------------- EXPORT PNG ---------------- */
  const exportPNG = async () => {
    const charts = [
      { ref: pieRef, name: "pie-chart" },
      { ref: barRef, name: "bar-chart" },
      { ref: lineRef, name: "line-chart" },
    ];

    for (const c of charts) {
      const canvas = await html2canvas(c.ref.current);
      const link = document.createElement("a");
      link.download = `${c.name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  /* ---------------- EXPORT PDF ---------------- */
  const exportPDF = async () => {
    const pdf = new jsPDF("landscape");
    const refs = [pieRef, barRef, lineRef];

    for (let i = 0; i < refs.length; i++) {
      const canvas = await html2canvas(refs[i].current);
      const img = canvas.toDataURL("image/png");
      if (i > 0) pdf.addPage();
      pdf.addImage(img, "PNG", 10, 10, 270, 150);
    }

    pdf.save("learning-analytics.pdf");
  };

  return (
    <div className="admin-charts-root">
      <div className="chart-header">
        <h2>Learning Analytics</h2>

        <div className="chart-controls">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Graph</option>
          </select>

          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

          <button onClick={loadData}>Apply</button>
          <button onClick={exportPNG}>PNG</button>
          <button onClick={exportPDF}>PDF</button>
        </div>
      </div>

      {/* ----------- VISIBLE CHART ----------- */}
      <div className="chart-body">
        {type === "pie" && <Pie data={pieData} options={chartOptions} />}
        {type === "bar" && <Bar data={progressData} options={chartOptions} />}
        {type === "line" && <Line data={progressData} options={chartOptions} />}
      </div>

      {/* ----------- HIDDEN EXPORT CHARTS ----------- */}
      <div className="chart-export-hidden">
        <div ref={pieRef}><Pie data={pieData} options={chartOptions} /></div>
        <div ref={barRef}><Bar data={progressData} options={chartOptions} /></div>
        <div ref={lineRef}><Line data={progressData} options={chartOptions} /></div>
      </div>
    </div>
  );
}
