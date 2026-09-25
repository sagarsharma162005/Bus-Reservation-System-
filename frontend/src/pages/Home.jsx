import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("Delhi");
  const [to, setTo] = useState("Lucknow");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBuses = async () => {
    setError("");

    if (!from || !to || !date) {
      setError("Please enter From, To and Date.");
      return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      setError("From and To locations cannot be same.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/buses/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to,
            date,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to search buses");
      }

      sessionStorage.setItem(
        "busSearch",
        JSON.stringify({
          from,
          to,
          date,
          buses: data.buses,
        })
      );

      navigate("/booking");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div
          className="brand"
          onClick={() => navigate("/")}
        >
          <div className="brand-icon">🚌</div>

          <div>
            <div className="brand-name">Bus Reservation System</div>
            <div className="brand-tagline">
              Travel made simple
            </div>
          </div>
        </div>

        <div className="nav-links">
          <button
            className="active-nav"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button onClick={() => navigate("/my-bookings")}>
            My Bookings
          </button>

          <button onClick={() => navigate("/login")}>
            Login
          </button>

          <button
            className="register-nav"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero-section">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-badge">
            ✦ SMARTER WAY TO TRAVEL
          </div>

          <h1>
            Your Journey.
            <br />
            <span>Our Responsibility.</span>
          </h1>

          <p>
            Find the perfect bus, choose your favourite seat,
            and book your journey in just a few clicks.
          </p>

          <div className="hero-stats">
            <div>
              <strong>100+</strong>
              <span>Routes</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Buses</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>

        </div>

        {/* ================= SEARCH CARD ================= */}
        <div className="search-wrapper">

          <div className="search-card">

            <div className="search-heading">
              <div className="search-icon">🔎</div>

              <div>
                <h2>Find Your Bus</h2>
                <p>
                  Search thousands of bus journeys
                </p>
              </div>
            </div>

            <div className="search-fields">

              {/* FROM */}
              <div className="input-group">
                <label>FROM</label>

                <div className="input-box">
                  <span>📍</span>

                  <div>
                    <small>Departure</small>

                    <input
                      type="text"
                      value={from}
                      onChange={(e) =>
                        setFrom(e.target.value)
                      }
                      placeholder="Enter city"
                    />
                  </div>
                </div>
              </div>

              {/* SWAP */}
              <button
                className="swap-button"
                onClick={swapLocations}
                type="button"
                title="Swap locations"
              >
                ⇄
              </button>

              {/* TO */}
              <div className="input-group">
                <label>TO</label>

                <div className="input-box">
                  <span>🎯</span>

                  <div>
                    <small>Destination</small>

                    <input
                      type="text"
                      value={to}
                      onChange={(e) =>
                        setTo(e.target.value)
                      }
                      placeholder="Enter city"
                    />
                  </div>
                </div>
              </div>

              {/* DATE */}
              <div className="input-group date-group">
                <label>TRAVEL DATE</label>

                <div className="input-box">
                  <span>📅</span>

                  <div>
                    <small>Select date</small>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* SEARCH */}
              <button
                className="search-button"
                onClick={searchBuses}
                disabled={loading}
                type="button"
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    Search Buses
                    <span>→</span>
                  </>
                )}
              </button>

            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">

        <div className="section-heading">
          <span>WHY BUSBOOKER?</span>

          <h2>
            Everything you need for a
            <br />
            <em>comfortable journey.</em>
          </h2>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-number">01</div>

            <div className="feature-icon">
              🔎
            </div>

            <h3>Easy Search</h3>

            <p>
              Search buses by destination and
              travel date in seconds.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">02</div>

            <div className="feature-icon">
              💺
            </div>

            <h3>Choose Your Seat</h3>

            <p>
              Pick your preferred seat before
              confirming your booking.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">03</div>

            <div className="feature-icon">
              🎫
            </div>

            <h3>Instant Booking</h3>

            <p>
              Get your booking confirmation
              quickly and securely.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">04</div>

            <div className="feature-icon">
              🛡️
            </div>

            <h3>Secure Experience</h3>

            <p>
              Your passenger and booking details
              are handled safely.
            </p>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div>
          <span>READY TO TRAVEL?</span>

          <h2>
            Your next adventure
            <br />
            starts here.
          </h2>
        </div>

        <button onClick={() => navigate("/")}>
          Search a Bus
          <span>→</span>
        </button>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-brand">
          <div className="brand-icon">🚌</div>

          <div>
            <strong>Bus Reservation System</strong>
            <span>Travel made simple.</span>
          </div>
        </div>

        <p>
          © 2026 Bus Reservation System. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;