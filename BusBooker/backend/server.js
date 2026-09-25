import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const app = express();
const PORT = process.env.PORT || 5000;

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());
app.use(express.json());

/* =====================================================
   MONGODB CONNECTION
===================================================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("=================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log("=================================");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
  });
/* =====================================================
   AI CHATBOT
===================================================== */

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const safeHistory = Array.isArray(history)
      ? history.slice(-10)
      : [];

    const conversation = safeHistory
      .filter(
        (item) =>
          item &&
          typeof item.role === "string" &&
          typeof item.content === "string"
      )
      .map((item) => ({
        role:
          item.role === "assistant"
            ? "assistant"
            : "user",
        content: item.content,
      }));

    conversation.push({
      role: "user",
      content: message.trim(),
    });

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are Bus Reservation System AI, a helpful travel assistant for the Bus Reservation System bus reservation website.

Your job is to help users with:
- Bus Reservation System website navigation
- Bus search
- Seat selection
- Booking process
- Passenger details
- Booking confirmation
- My Bookings
- General bus travel questions

Important rules:
1. Be friendly and concise.
2. Use simple English.
3. You may understand Hinglish/Hindi questions and reply naturally.
4. Do not invent real-time bus availability, prices, bookings, or seat availability.
5. If the user asks about a specific booking, tell them to use My Bookings unless booking information has been provided in the conversation.
6. You cannot directly make or cancel a booking.
7. Never ask for passwords, OTPs, credit card numbers, or API keys.
8. If the user asks something unrelated to Bus Reservation System, politely say you mainly help with Bus Reservation System and bus-travel questions.
      `,

      input: conversation,
    });

    const answer =
      response.output_text ||
      "Sorry, I couldn't generate a response.";

    res.json({
      success: true,
      reply: answer,
    });
  } catch (error) {
    console.error("❌ AI Chat Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message:
        "AI assistant is temporarily unavailable.",
    });
  }
});
/* =====================================================
   BOOKING SCHEMA
===================================================== */

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    busId: {
      type: Number,
      required: true,
    },

    busName: {
      type: String,
      required: true,
    },

    operator: {
      type: String,
      default: "",
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    departure: {
      type: String,
      default: "",
    },

    arrival: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    seats: {
      type: [Number],
      required: true,
    },

    passengerName: {
      type: String,
      required: true,
    },

    passengerEmail: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

/* =====================================================
   HOME / HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bus Reservation System Backend + MongoDB is Running 🚍",
  });
});

/* =====================================================
   BUS SEARCH
===================================================== */

app.post("/api/buses/search", (req, res) => {
  try {
    const { from, to, date } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: "From, To and Date are required",
      });
    }

    const buses = [
      {
        id: 1,
        name: "Volvo Express",
        operator: "Bus Reservation System Travels",
        from,
        to,
        date,
        departure: "08:00 AM",
        arrival: "02:00 PM",
        duration: "6h",
        price: 699,
        seats: 32,
      },

      {
        id: 2,
        name: "Night Rider",
        operator: "City Travels",
        from,
        to,
        date,
        departure: "10:00 PM",
        arrival: "05:30 AM",
        duration: "7h 30m",
        price: 799,
        seats: 28,
      },

      {
        id: 3,
        name: "Super Fast",
        operator: "Roadways Express",
        from,
        to,
        date,
        departure: "11:30 AM",
        arrival: "05:30 PM",
        duration: "6h",
        price: 599,
        seats: 35,
      },
    ];

    res.json({
      success: true,
      buses,
    });
  } catch (error) {
    console.error("❌ Bus Search Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to search buses",
    });
  }
});

/* =====================================================
   GET BOOKED SEATS
===================================================== */

app.get("/api/bookings/booked-seats", async (req, res) => {
  try {
    const { busId, date } = req.query;

    if (!busId || !date) {
      return res.status(400).json({
        success: false,
        message: "busId and date are required",
      });
    }

    const bookings = await Booking.find({
      busId: Number(busId),
      date: date,
      status: "Confirmed",
    });

    const bookedSeats = [];

    bookings.forEach((booking) => {
      booking.seats.forEach((seat) => {
        if (!bookedSeats.includes(seat)) {
          bookedSeats.push(seat);
        }
      });
    });

    bookedSeats.sort((a, b) => a - b);

    res.json({
      success: true,
      busId: Number(busId),
      date,
      bookedSeats,
    });
  } catch (error) {
    console.error("❌ Booked Seats Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booked seats",
    });
  }
});

/* =====================================================
   REGISTER
===================================================== */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const user = new User({
      name: name.trim(),
      email: cleanEmail,
      password,
    });

    await user.save();

    console.log("=================================");
    console.log("✅ NEW USER REGISTERED");
    console.log("👤 Name:", user.name);
    console.log("📧 Email:", user.email);
    console.log("=================================");

    res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

/* =====================================================
   LOGIN
===================================================== */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("=================================");
    console.log("✅ USER LOGGED IN");
    console.log("📧 Email:", user.email);
    console.log("=================================");

    res.json({
      success: true,
      message: "Login successful",

      token: "busbooker-demo-token",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

/* =====================================================
   CREATE BOOKING
===================================================== */

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      busId,
      busName,
      operator,
      from,
      to,
      date,
      departure,
      arrival,
      duration,
      price,
      seats,
      passengerName,
      passengerEmail,
      phone,
      totalAmount,
    } = req.body;

    /* -----------------------------------------------
       BASIC VALIDATION
    ------------------------------------------------ */

    if (
      !busId ||
      !busName ||
      !from ||
      !to ||
      !date ||
      !seats ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      !passengerName ||
      !passengerEmail ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking information is incomplete",
      });
    }

    /* -----------------------------------------------
       REMOVE DUPLICATE SEATS FROM REQUEST
    ------------------------------------------------ */

    const uniqueSeats = [...new Set(seats.map(Number))];

    if (uniqueSeats.length !== seats.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate seats are not allowed",
      });
    }

    /* -----------------------------------------------
       MAX 6 SEATS
    ------------------------------------------------ */

    if (uniqueSeats.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can book maximum 6 seats at a time",
      });
    }

    /* -----------------------------------------------
       CHECK ALREADY BOOKED SEATS
    ------------------------------------------------ */

    const existingBookings = await Booking.find({
      busId: Number(busId),
      date: date,
      status: "Confirmed",
    });

    const alreadyBookedSeats = [];

    existingBookings.forEach((booking) => {
      booking.seats.forEach((seat) => {
        if (!alreadyBookedSeats.includes(seat)) {
          alreadyBookedSeats.push(seat);
        }
      });
    });

    const conflictingSeats = uniqueSeats.filter((seat) =>
      alreadyBookedSeats.includes(seat)
    );

    /* -----------------------------------------------
       STOP DUPLICATE BOOKING
    ------------------------------------------------ */

    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seat${
          conflictingSeats.length > 1 ? "s" : ""
        } ${conflictingSeats.join(
          ", "
        )} already booked. Please select another seat.`,
        conflictingSeats,
      });
    }

    /* -----------------------------------------------
       CREATE BOOKING
    ------------------------------------------------ */

    const booking = new Booking({
      bookingId: "BB" + Date.now(),

      busId: Number(busId),

      busName,

      operator: operator || "",

      from,

      to,

      date,

      departure: departure || "",

      arrival: arrival || "",

      duration: duration || "",

      price: Number(price) || 0,

      seats: uniqueSeats,

      passengerName: passengerName.trim(),

      passengerEmail: passengerEmail
        .trim()
        .toLowerCase(),

      phone: phone || "",

      totalAmount: Number(totalAmount),

      status: "Confirmed",
    });

    await booking.save();

    console.log("=================================");
    console.log("✅ BOOKING SAVED");
    console.log("🎫 Booking ID:", booking.bookingId);
    console.log("👤 Passenger:", booking.passengerName);
    console.log("🚌 Bus:", booking.busName);
    console.log("💺 Seats:", booking.seats.join(", "));
    console.log("📅 Date:", booking.date);
    console.log("=================================");

    res.status(201).json({
      success: true,
      message: "Booking confirmed and saved to MongoDB",
      booking,
    });
  } catch (error) {
    console.error("❌ Booking Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save booking",
      error: error.message,
    });
  }
});

/* =====================================================
   GET ALL BOOKINGS
===================================================== */

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("❌ Fetch Bookings Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
});

/* =====================================================
   GET SINGLE BOOKING
===================================================== */

app.get("/api/bookings/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("❌ Single Booking Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
});

/* =====================================================
   404
===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚍 Bus Reservation System Backend Started");
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log("=================================");
});