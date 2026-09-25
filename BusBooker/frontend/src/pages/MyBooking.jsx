import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBooking.css";

function MyBooking() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/bookings"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load bookings"
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load bookings. Please check if backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("busbookerToken");
    localStorage.removeItem("busbookerUser");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const viewTicket = (booking) => {
    sessionStorage.setItem(
      "confirmedBooking",
      JSON.stringify(booking)
    );

    navigate("/confirmation");
  };

  return (
    <div className="my-booking-page">

      {/* ================= NAVBAR ================= */}

      <nav className="my-booking-navbar">

        <div
          className="my-booking-brand"
          onClick={() => navigate("/")}
        >
          <div className="my-booking-brand-icon">
            🚌
          </div>

          <div>
            <strong>Bus Reservation System</strong>
            <span>Travel made simple</span>
          </div>
        </div>

        <div className="my-booking-nav-links">

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button
            className="my-booking-active"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="my-booking-container">

        <div className="my-booking-header">

          <div>
            <span className="my-booking-label">
              TRAVEL HISTORY
            </span>

            <h1>
              My Bookings
            </h1>

            <p>
              View and manage all your Bus Reservation System journeys.
            </p>
          </div>

          <button
            className="book-new-button"
            onClick={() => navigate("/")}
          >
            + Book New Journey
          </button>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="my-booking-loading">

            <div className="my-booking-spinner"></div>

            <h3>
              Loading your bookings...
            </h3>

            <p>
              Please wait a moment.
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="my-booking-error">

            <div>
              ⚠️
            </div>

            <div>
              <strong>
                Unable to load bookings
              </strong>

              <p>
                {error}
              </p>

              <button onClick={fetchBookings}>
                Try Again
              </button>
            </div>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          bookings.length === 0 && (

            <div className="empty-bookings">

              <div className="empty-icon">
                🎫
              </div>

              <h2>
                No bookings yet
              </h2>

              <p>
                Your confirmed journeys will appear here.
              </p>

              <button
                onClick={() => navigate("/")}
              >
                Search Buses →
              </button>

            </div>
          )}

        {/* ================= BOOKINGS ================= */}

        {!loading &&
          !error &&
          bookings.length > 0 && (

            <div className="bookings-content">

              <div className="booking-count">
                <span>
                  {bookings.length}
                </span>

                {bookings.length === 1
                  ? " booking found"
                  : " bookings found"}
              </div>

              <div className="booking-list">

                {bookings.map((booking, index) => (

                  <article
                    className="booking-history-card"
                    key={
                      booking._id ||
                      booking.bookingId ||
                      index
                    }
                  >

                    {/* CARD TOP */}

                    <div className="history-card-top">

                      <div className="history-bus">

                        <div className="history-bus-icon">
                          🚌
                        </div>

                        <div>
                          <h2>
                            {booking.busName}
                          </h2>

                          <p>
                            {booking.operator ||
                              "Bus Reservation System Travels"}
                          </p>
                        </div>

                      </div>

                      <div className="confirmed-badge">
                        ✓ {booking.status || "Confirmed"}
                      </div>

                    </div>

                    {/* ROUTE */}

                    <div className="history-route">

                      <div className="history-location">

                        <span>
                          {booking.from}
                        </span>

                        <small>
                          Departure
                        </small>

                      </div>

                      <div className="history-route-line">

                        <span>🚌</span>

                        <div></div>

                      </div>

                      <div className="history-location destination">

                        <span>
                          {booking.to}
                        </span>

                        <small>
                          Arrival
                        </small>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="history-details">

                      <div>
                        <span>TRAVEL DATE</span>
                        <strong>
                          {formatDate(booking.date)}
                        </strong>
                      </div>

                      <div>
                        <span>SEATS</span>
                        <strong>
                          {booking.seats
                            ?.sort((a, b) => a - b)
                            .join(", ") || "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>PASSENGER</span>
                        <strong>
                          {booking.passengerName}
                        </strong>
                      </div>

                      <div>
                        <span>BOOKING ID</span>
                        <strong className="booking-id-text">
                          {booking.bookingId}
                        </strong>
                      </div>

                    </div>

                    {/* BOTTOM */}

                    <div className="history-card-bottom">

                      <div className="history-price">

                        <span>
                          TOTAL FARE
                        </span>

                        <strong>
                          ₹{booking.totalAmount}
                        </strong>

                      </div>

                      <div className="history-actions">

                        <button
                          className="view-ticket-button"
                          onClick={() =>
                            viewTicket(booking)
                          }
                        >
                          🎫 View Ticket
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            </div>
          )}

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="my-booking-footer">

        <div>
          <strong>🚌 Bus Reservation System</strong>
          <span>Travel made simple.</span>
        </div>

        <p>
          © 2026 Bus Reservation System. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default MyBooking;