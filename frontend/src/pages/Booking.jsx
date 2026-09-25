import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

function Booking() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  /* =====================================================
     LOAD SEARCH DATA
  ===================================================== */

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("busSearch");

    if (!savedSearch) {
      navigate("/");
      return;
    }

    try {
      const data = JSON.parse(savedSearch);

      setSearchData(data);

      if (data.buses && data.buses.length > 0) {
        setSelectedBus(data.buses[0]);
      }
    } catch (error) {
      console.error("Search data error:", error);
      navigate("/");
    }
  }, [navigate]);

  /* =====================================================
     FETCH BOOKED SEATS FROM MONGODB
  ===================================================== */

  useEffect(() => {
    if (!selectedBus || !searchData) {
      return;
    }

    const fetchBookedSeats = async () => {
      try {
        setLoadingSeats(true);

        const url =
          `http://localhost:5000/api/bookings/booked-seats` +
          `?busId=${selectedBus.id}` +
          `&date=${searchData.date}`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch booked seats"
          );
        }

        setBookedSeats(data.bookedSeats || []);

        // Agar selected seats mein koi newly booked seat ho
        // to usko remove kar do
        setSelectedSeats((previousSeats) =>
          previousSeats.filter(
            (seat) => !(data.bookedSeats || []).includes(seat)
          )
        );
      } catch (error) {
        console.error("Booked seats error:", error);

        setBookedSeats([]);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchBookedSeats();
  }, [selectedBus, searchData]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (!searchData || !selectedBus) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading buses...</p>
      </div>
    );
  }

  /* =====================================================
     TOTAL AMOUNT
  ===================================================== */

  const totalAmount =
    selectedSeats.length * selectedBus.price;

  /* =====================================================
     TOGGLE SEAT
  ===================================================== */

  const toggleSeat = (seatNumber) => {
    // Already booked seat
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    // Remove selected seat
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat !== seatNumber
        )
      );

      return;
    }

    // Maximum 6 seats
    if (selectedSeats.length >= 6) {
      alert("You can select maximum 6 seats.");
      return;
    }

    // Add seat
    setSelectedSeats([
      ...selectedSeats,
      seatNumber,
    ]);
  };

  /* =====================================================
     CONTINUE BOOKING
  ===================================================== */

  const continueBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const bookingData = {
      busId: selectedBus.id,
      busName: selectedBus.name,
      operator: selectedBus.operator,

      from: searchData.from,
      to: searchData.to,
      date: searchData.date,

      departure: selectedBus.departure,
      arrival: selectedBus.arrival,
      duration: selectedBus.duration,

      price: selectedBus.price,

      seats: [...selectedSeats].sort(
        (a, b) => a - b
      ),

      totalAmount,
    };

    sessionStorage.setItem(
      "selectedBooking",
      JSON.stringify(bookingData)
    );

    const token =
      localStorage.getItem("busbookerToken");

    if (token) {
      navigate("/passenger-details");
    } else {
      navigate("/login");
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

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

  /* =====================================================
     GENERATE SEATS
  ===================================================== */

  const generateSeats = (totalSeats) => {
    return Array.from(
      { length: totalSeats },
      (_, index) => index + 1
    );
  };

  /* =====================================================
     SELECT BUS
  ===================================================== */

  const selectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setBookedSeats([]);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="booking-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="booking-navbar">

        <div
          className="booking-brand"
          onClick={() => navigate("/")}
        >
          <div className="booking-brand-icon">
            🚌
          </div>

          <div>
            <strong>Bus Reservation System</strong>
            <span>Travel made simple</span>
          </div>
        </div>

        <div className="booking-nav-right">

          <div className="journey-mini">
            <span>{searchData.from}</span>
            <b>→</b>
            <span>{searchData.to}</span>
          </div>

          <button
            onClick={() => navigate("/")}
          >
            ← Change Search
          </button>

        </div>

      </nav>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="booking-container">

        {/* HEADER */}

        <div className="booking-page-header">

          <div>

            <span className="page-label">
              AVAILABLE BUSES
            </span>

            <h1>Choose your bus</h1>

            <p>
              {searchData.from} →{" "}
              {searchData.to}

              <span> • </span>

              {formatDate(searchData.date)}
            </p>

          </div>

          <div className="step-indicator">

            <div className="step active">
              <span>1</span>
              <label>Bus & Seat</label>
            </div>

            <div className="step-line"></div>

            <div className="step">
              <span>2</span>
              <label>Passenger</label>
            </div>

            <div className="step-line"></div>

            <div className="step">
              <span>3</span>
              <label>Confirm</label>
            </div>

          </div>

        </div>

        {/* =================================================
            BUS LIST
        ================================================= */}

        <section className="bus-section">

          <div className="section-title">

            <div>
              <h2>Select a bus</h2>

              <p>
                {searchData.buses.length} buses available
              </p>
            </div>

          </div>

          <div className="bus-list">

            {searchData.buses.map((bus) => (

              <div
                key={bus.id}
                className={`bus-card ${
                  selectedBus.id === bus.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => selectBus(bus)}
              >

                <div className="bus-main">

                  <div className="bus-logo">
                    🚌
                  </div>

                  <div className="bus-info">

                    <h3>{bus.name}</h3>

                    <p>{bus.operator}</p>

                    <div className="bus-tags">
                      <span>AC</span>
                      <span>Seater</span>
                      <span>Live Tracking</span>
                    </div>

                  </div>

                </div>

                <div className="bus-time">

                  <div>
                    <strong>
                      {bus.departure}
                    </strong>

                    <span>
                      {searchData.from}
                    </span>
                  </div>

                  <div className="duration">

                    <span></span>

                    <small>
                      {bus.duration}
                    </small>

                    <span></span>

                  </div>

                  <div>

                    <strong>
                      {bus.arrival}
                    </strong>

                    <span>
                      {searchData.to}
                    </span>

                  </div>

                </div>

                <div className="bus-price">

                  <small>
                    Starting from
                  </small>

                  <strong>
                    ₹{bus.price}
                  </strong>

                  <span>
                    per seat
                  </span>

                </div>

                <div className="bus-select">

                  <div
                    className={
                      selectedBus.id === bus.id
                        ? "radio active"
                        : "radio"
                    }
                  >
                    {selectedBus.id === bus.id &&
                      "✓"}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* =================================================
            SEAT SECTION
        ================================================= */}

        <section className="seat-section">

          <div className="seat-header">

            <div>

              <span className="page-label">
                SEAT SELECTION
              </span>

              <h2>
                Pick your favourite seat
              </h2>

              <p>
                Select up to 6 seats
              </p>

            </div>

            <div className="seat-legend">

              <div>
                <span className="legend-seat available"></span>
                Available
              </div>

              <div>
                <span className="legend-seat selected-seat"></span>
                Selected
              </div>

              <div>
                <span className="legend-seat booked"></span>
                Booked
              </div>

            </div>

          </div>

          {loadingSeats && (
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                fontSize: "14px",
              }}
            >
              Checking seat availability...
            </div>
          )}

          <div className="seat-content">

            {/* BUS */}

            <div className="bus-layout">

              <div className="bus-front">

                <div className="driver">
                  <span>STEERING</span>
                  🛞
                </div>

                <span>FRONT</span>

              </div>

              <div className="seat-grid">

                {generateSeats(
                  selectedBus.seats
                ).map((seat) => {

                  const isBooked =
                    bookedSeats.includes(seat);

                  const isSelected =
                    selectedSeats.includes(seat);

                  return (
                    <button
                      key={seat}
                      type="button"
                      disabled={isBooked}
                      className={`seat ${
                        isBooked
                          ? "booked"
                          : isSelected
                          ? "selected-seat"
                          : "available"
                      }`}
                      onClick={() =>
                        toggleSeat(seat)
                      }
                    >

                      <span className="seat-icon">
                        💺
                      </span>

                      <small>{seat}</small>

                    </button>
                  );
                })}

              </div>

              <div className="bus-back">
                BACK
              </div>

            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <aside className="booking-summary">

              <div className="summary-header">

                <span>Your journey</span>

                <strong>
                  {searchData.from} →{" "}
                  {searchData.to}
                </strong>

              </div>

              <div className="summary-bus">

                <div className="summary-bus-icon">
                  🚌
                </div>

                <div>

                  <strong>
                    {selectedBus.name}
                  </strong>

                  <span>
                    {selectedBus.operator}
                  </span>

                </div>

              </div>

              <div className="summary-details">

                <div>
                  <span>Date</span>
                  <strong>
                    {formatDate(searchData.date)}
                  </strong>
                </div>

                <div>
                  <span>Departure</span>
                  <strong>
                    {selectedBus.departure}
                  </strong>
                </div>

                <div>
                  <span>Arrival</span>
                  <strong>
                    {selectedBus.arrival}
                  </strong>
                </div>

              </div>

              <div className="selected-seat-box">

                <span>
                  Selected seats
                </span>

                {selectedSeats.length > 0 ? (

                  <div className="selected-seat-list">

                    {[...selectedSeats]
                      .sort(
                        (a, b) => a - b
                      )
                      .map((seat) => (

                        <span key={seat}>
                          {seat}
                        </span>

                      ))}

                  </div>

                ) : (

                  <p>
                    No seat selected
                  </p>

                )}

              </div>

              <div className="fare-box">

                <div>

                  <span>
                    Seat fare
                  </span>

                  <strong>
                    ₹{selectedBus.price} ×{" "}
                    {selectedSeats.length}
                  </strong>

                </div>

                <div className="total-row">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{totalAmount}
                  </strong>

                </div>

              </div>

              <button
                className="continue-button"
                onClick={continueBooking}
              >
                Continue Booking
                <span>→</span>
              </button>

              <p className="secure-note">
                🔒 Secure & safe booking
              </p>

            </aside>

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="booking-footer">

        <span>
          🚌 Bus Reservation System
        </span>

        <p>
          © 2026 Bus Reservation System. Travel made simple.
        </p>

      </footer>

    </div>
  );
}

export default Booking;