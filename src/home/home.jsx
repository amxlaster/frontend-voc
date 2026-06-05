// src/home/home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import Logo from "../assets/logo.png";
import Hero from "../assets/hero.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      {/* Topbar */}
      <div className="topbar">
        <div className="container d-flex align-items-center ps-lg-1 ps-md-4 ps-2">
          <img src={Logo} className="logo" alt="SwanZaa" />
        </div>
      </div>

      {/* Main section */}
      <section className="main-section container py-5">
        <div className="row align-items-center">

          {/* Left block */}
          <div className="col-md-6 mb-4 mb-md-0 text-center text-md-start">
            <h1 className="heading">
              Upgrade your English, <br />
              Upgrade your creative edge
            </h1>

            <p className="tagline">
              Designed for Viscom minds, powered by words
            </p>

            <button
              className="cta-btn btn rounded-pill"
              onClick={() => navigate("/user")}
              aria-label="Continue"
            >
              Continue
            </button>
          </div>

          {/* Right block */}
          <div className="col-md-5 text-center text-md-end">
            <img src={Hero} className="hero-img img-fluid" alt="hero" />
          </div>
        </div>
      </section>

      {/* ⭐ FOOTER ADDED HERE ⭐ */}
      <footer className="home-footer text-center py-3 mt-5">
        <p
          className="footer-text"
          style={{ cursor: "pointer", margin: 0 }}
          onClick={() => window.open("https://arumexa.com/", "_blank")}
        >
          © AruMeXa Tech Pvt Ltd 2025
        </p>
      </footer>

    </div>
  );
}
