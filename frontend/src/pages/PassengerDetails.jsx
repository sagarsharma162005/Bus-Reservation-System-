import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PassengerDetails.css";

function PassengerDetails() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  const [form, setForm] = useState({
    passengerName: "",
    passengerEmail: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedBooking = sessionStorage.getItem("selectedBooking");

    if (!savedBooking) {
      navigate("/");
      return;
    }

    try {
      const data = JSON.parse(savedBooking);
      setBooking(data);

      const savedUser = localStorage.getItem("busbookerUser");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setForm((prev) => ({
          ...prev,
          passengerName: user.name || "",
          passengerEmail: user.email || "",
        }));
      }
    } catch (error) {
      console.error("Booking data error:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const confirmBooking = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.passengerName.trim()) {
      setError("Please enter passenger name.");
      return;
    }

    if (!form.passengerEmail.trim()) {
      setError("Please enter email address.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter phone number.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            busId: booking.busId,
            busName: booking.busName,
            from: booking.from,
            to: booking.to,
            date: booking.date,
            seats: booking.seats,
            passengerName: form.passengerName.trim(),
            passengerEmail: form.passengerEmail.trim(),
            phone: form.phone.trim(),
            totalAmount: booking.totalAmount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Booking failed"
        );
      }

      sessionStorage.setItem(
        "confirmedBooking",
        JSON.stringify(data.booking)
      );

      sessionStorage.removeItem("selectedBooking");

      navigate("/confirmation");
    } catch (error) {
      console.error("Booking error:", error);

      setError(
        error.message ||
          "Unable to confirm booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!booking) {
    return (
      <div className="passenger-loading">
        <div className="passenger-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="passenger-page">

      {/* ================= NAVBAR ================= */}

      <nav className="passenger-navbar">

        <div
          className="passenger-brand"
          onClick={() => navigate("/")}
        >
          <div className="passenger-brand-icon">
            🚌
          </div>

          <div>
            <strong>Bus Reservation System</strong>
            <span>Travel made simple</span>
          </div>
        </div>

        <button
          className="back-search"
          onClick={() => navigate("/booking")}
        >
          ← Back to seats
        </button>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="passenger-container">

        {/* HEADER */}

        <div className="passenger-header">

          <div>
            <span className="passenger-label">
              STEP 2 OF 3
            </span>

            <h1>
              Passenger details
            </h1>

            <p>
              Enter the details of the person travelling.
            </p>
          </div>

          <div className="progress-steps">

            <div className="progress-step done">
              <span>✓</span>
              <small>Bus & Seat</small>
            </div>

            <div className="progress-line active"></div>

            <div className="progress-step current">
              <span>2</span>
              <small>Passenger</small>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step">
              <span>3</span>
              <small>Confirm</small>
            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="passenger-content">

          {/* ================= FORM ================= */}

          <section className="passenger-form-card">

            <div className="form-card-header">

              <div className="form-icon">
                👤
              </div>

              <div>
                <h2>Passenger information</h2>
                <p>
                  Please provide accurate details.
                </p>
              </div>

            </div>

            <form onSubmit={confirmBooking}>

              <div className="form-group">

                <label>
                  FULL NAME
                </label>

                <div className="form-input">

                  <span>👤</span>

                  <input
                    type="text"
                    name="passengerName"
                    value={form.passengerName}
                    onChange={handleChange}
                    placeholder="Enter passenger name"
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  EMAIL ADDRESS
                </label>

                <div className="form-input">

                  <span>✉️</span>

                  <input
                    type="email"
                    name="passengerEmail"
                    value={form.passengerEmail}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  PHONE NUMBER
                </label>

                <div className="form-input">

                  <span>📱</span>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                  />

                </div>

              </div>

              {error && (
                <div className="passenger-error">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-note">
                🔒 Your information is used only for booking
                and travel communication.
              </div>

              <button
                type="submit"
                className="confirm-booking-button"
                disabled={loading}
              >
                {loading
                  ? "Confirming Booking..."
                  : "Confirm Booking"}

                {!loading && <span>→</span>}
              </button>

            </form>

          </section>

          {/* ================= SUMMARY ================= */}

          <aside className="passenger-summary">

            <div className="summary-title">
              <span>YOUR BOOKING</span>
              <h2>Trip summary</h2>
            </div>

            {/* BUS */}

            <div className="passenger-bus">

              <div className="passenger-bus-icon">
                🚌
              </div>

              <div>
                <strong>{booking.busName}</strong>

                <span>
                  {booking.operator ||
                    "Bus Reservation System Travels"}
                </span>
              </div>

            </div>

            {/* ROUTE */}

            <div className="route-box">

              <div className="route-point">

                <span className="route-dot"></span>

                <div>
                  <small>FROM</small>
                  <strong>{booking.from}</strong>
                </div>

              </div>

              <div className="route-line"></div>

              <div className="route-point">

                <span className="route-dot destination"></span>

                <div>
                  <small>TO</small>
                  <strong>{booking.to}</strong>
                </div>

              </div>

            </div>

            {/* DETAILS */}

            <div className="trip-details">

              <div>
                <span>📅 Travel date</span>
                <strong>
                  {formatDate(booking.date)}
                </strong>
              </div>

              <div>
                <span>🕐 Departure</span>
                <strong>
                  {booking.departure || "08:00 AM"}
                </strong>
              </div>

              <div>
                <span>⏱ Duration</span>
                <strong>
                  {booking.duration || "6h"}
                </strong>
              </div>

              <div>
                <span>💺 Seats</span>
                <strong>
                  {booking.seats
                    ?.sort((a, b) => a - b)
                    .join(", ")}
                </strong>
              </div>

            </div>

            {/* FARE */}

            <div className="passenger-fare">

              <div>
                <span>Seat fare</span>
                <strong>
                  ₹{booking.price} ×{" "}
                  {booking.seats?.length}
                </strong>
              </div>

              <div className="passenger-total">

                <span>Total amount</span>

                <strong>
                  ₹{booking.totalAmount}
                </strong>

              </div>

            </div>

            <div className="secure-box">
              <span>🛡️</span>

              <div>
                <strong>Secure booking</strong>
                <p>
                  Your booking details are safely stored.
                </p>
              </div>
            </div>

          </aside>

        </div>

      </main>

      {/* FOOTER */}

      <footer className="passenger-footer">
        <span>🚌 Bus Reservation System</span>

        <p>
          © 2026 Bus Reservation System. Travel made simple.
        </p>
      </footer>

    </div>
  );
}

export default PassengerDetails;