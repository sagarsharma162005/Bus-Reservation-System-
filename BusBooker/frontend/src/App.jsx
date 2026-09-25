import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import PassengerDetails from "./pages/PassengerDetails";
import Confirmation from "./pages/Confirmation";
import MyBooking from "./pages/MyBooking";

import ChatBot from "./components/ChatBot";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/booking"
          element={<Booking />}
        />

        <Route
          path="/passenger-details"
          element={<PassengerDetails />}
        />

        <Route
          path="/confirmation"
          element={<Confirmation />}
        />

        <Route
          path="/my-bookings"
          element={<MyBooking />}
        />

      </Routes>

      {/* AI ASSISTANT */}
      <ChatBot />

    </BrowserRouter>
  );
}

export default App;