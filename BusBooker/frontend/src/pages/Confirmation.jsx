import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Confirmation.css";

function Confirmation() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const savedBooking =
      sessionStorage.getItem("confirmedBooking");

    if (!savedBooking) {
      navigate("/");
      return;
    }

    try {
      setBooking(JSON.parse(savedBooking));
    } catch (error) {
      console.error("Confirmation data error:", error);
      navigate("/");
    }
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const printTicket = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="confirmation-loading">
        <div className="confirmation-spinner"></div>
        <p>Loading your ticket...</p>
      </div>
    );
  }

  return (
    <div className="confirmation-page">

      {/* ================= NAVBAR ================= */}

      <nav className="confirmation-navbar">

        <div
          className="confirmation-brand"
          onClick={() => navigate("/")}
        >
          <div className="confirmation-brand-icon">
            🚌
          </div>

          <div>
            <strong>Bus Reservation System</strong>
            <span>Travel made simple</span>
          </div>
        </div>

        <div className="confirmation-nav-actions">

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="confirmation-container">

        {/* SUCCESS */}

        <section className="success-section">

          <div className="success-icon">
            ✓
          </div>

          <span className="success-label">
            BOOKING CONFIRMED
          </span>

          <h1>
            Your seat is booked!
          </h1>

          <p>
            Your journey has been successfully confirmed.
            Have a safe and comfortable trip.
          </p>

        </section>

        {/* ================= TICKET ================= */}

        <section className="ticket">

          {/* Ticket Header */}

          <div className="ticket-header">

            <div className="ticket-logo">

              <div className="ticket-bus-icon">
                🚌
              </div>

              <div>
                <strong>Bus Reservation System</strong>
                <span>BUS TICKET</span>
              </div>

            </div>

            <div className="ticket-status">
              <span>STATUS</span>
              <strong>✓ CONFIRMED</strong>
            </div>

          </div>

          {/* Booking ID */}

          <div className="booking-id-section">

            <div>
              <span>BOOKING ID</span>
              <strong>{booking.bookingId}</strong>
            </div>

            <div className="booking-id-note">
              Keep this ID for your records
            </div>

          </div>

          {/* Route */}

          <div className="ticket-route">

            <div className="ticket-city">

              <span className="ticket-time">
                {booking.departure || "08:00 AM"}
              </span>

              <strong>{booking.from}</strong>

              <small>
                Departure
              </small>

            </div>

            <div className="ticket-route-middle">

              <span>🚌</span>

              <div className="ticket-route-line">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <small>
                {booking.duration || "6h"}
              </small>

            </div>

            <div className="ticket-city destination">

              <span className="ticket-time">
                {booking.arrival || "02:00 PM"}
              </span>

              <strong>{booking.to}</strong>

              <small>
                Arrival
              </small>

            </div>

          </div>

          {/* Dashed Divider */}

          <div className="ticket-divider">
            <span></span>
            <div></div>
            <span></span>
          </div>

          {/* Journey Details */}

          <div className="ticket-details">

            <div>
              <span>TRAVEL DATE</span>
              <strong>
                {formatDate(booking.date)}
              </strong>
            </div>

            <div>
              <span>BUS</span>
              <strong>
                {booking.busName}
              </strong>
            </div>

            <div>
              <span>OPERATOR</span>
              <strong>
                {booking.operator ||
                  "Bus Reservation System Travels"}
              </strong>
            </div>

            <div>
              <span>SEATS</span>
              <strong>
                {booking.seats
                  ?.sort((a, b) => a - b)
                  .join(", ")}
              </strong>
            </div>

          </div>

          {/* Passenger */}

          <div className="passenger-ticket-section">

            <div className="ticket-section-title">
              PASSENGER DETAILS
            </div>

            <div className="passenger-ticket-grid">

              <div>
                <span>NAME</span>
                <strong>
                  {booking.passengerName}
                </strong>
              </div>

              <div>
                <span>EMAIL</span>
                <strong>
                  {booking.passengerEmail}
                </strong>
              </div>

              <div>
                <span>PHONE</span>
                <strong>
                  {booking.phone || "Not available"}
                </strong>
              </div>

            </div>

          </div>

          {/* Fare */}

          <div className="ticket-fare">

            <div>
              <span>SEAT FARE</span>

              <strong>
                ₹{booking.totalAmount}
              </strong>
            </div>

            <div className="ticket-total">
              <span>TOTAL PAID</span>

              <strong>
                ₹{booking.totalAmount}
              </strong>
            </div>

          </div>

          {/* Footer */}

          <div className="ticket-footer">

            <div>
              <strong>Thank you for choosing Bus Reservation System.</strong>

              <p>
                Please carry a valid ID proof while travelling.
              </p>
            </div>

            <div className="ticket-code">
              {booking.bookingId}
            </div>

          </div>

        </section>

        {/* ================= ACTIONS ================= */}

        <div className="confirmation-actions">

          <button
            className="print-ticket-button"
            onClick={printTicket}
          >
            🖨️ Print Ticket
          </button>

          <button
            className="my-bookings-button"
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings →
          </button>

        </div>

        <div className="confirmation-note">
          🔒 Your booking has been securely saved to Bus Reservation System.
        </div>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="confirmation-footer">

        <span>🚌 Bus Reservation System</span>

        <p>
          © 2026 Bus Reservation System. Travel made simple.
        </p>

      </footer>

    </div>
  );
}

export default Confirmation;