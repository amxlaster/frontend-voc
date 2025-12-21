import React, { useEffect, useState } from "react";
import API from "../../../../lib/api";
import "./WOTD.css";

export default function WOTD() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadQuote = async () => {
    try {
      const res = await API.get("/quotes/wotd");
      setQuote(res.data.quote);  // ✅ CORRECT
    } catch (err) {
      console.error("WOTD error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();
  }, []);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (!quote) return <h2>No quote available</h2>;

  return (
    <div className="wotd-wrapper">
      <h1 className="wotd-title">WOTD - Word Of The Day</h1>

      <div className="wotd-card">
        <h2 className="wotd-word">{quote.text}</h2>
        <p className="wotd-meaning">— {quote.author}</p>
      </div>
    </div>
  );
}
