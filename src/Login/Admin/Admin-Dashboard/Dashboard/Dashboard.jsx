import React, { useEffect, useState, useRef } from "react";
import API from "../../../../lib/api";
import Typed from "typed.js";
import heroImg from "../../../../assets/student-hero.png";
import "./Dashboard.css";

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const typedRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin");
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!admin) return;

    const typed = new Typed(typedRef.current, {
      strings: [
        `Welcome ${admin.name || "Admin"}`,
        "Hope you're having a great day!",
        "Let's manage students easily!",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1200,
      loop: true,
      smartBackspace: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => typed.destroy();
  }, [admin]);

  return (
    <div className="admin-dashboard-main">
<div className="admin-hero-wrapper">
        <img src={heroImg} alt="Admin Hero" className="admin-hero-img" />
      </div>
      {/* TYPED TEXT */}
      <h1 className="admin-title">
        <span ref={typedRef}></span>
        <span className="wave-emoji">🤝</span>
      </h1>

      {/* HERO IMAGE */}
      

    </div>
  );
}
