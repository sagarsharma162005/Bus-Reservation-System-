import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* ================= LEFT SIDE ================= */}

      <section className="register-visual">

        <div className="register-visual-overlay"></div>

        <div
          className="register-back"
          onClick={() => navigate("/")}
        >
          ← Back to home
        </div>

        <div className="register-visual-content">

          <div className="register-visual-badge">
            ✦ JOIN BUSBOOKER
          </div>

          <h1>
            Your journey
            <br />
            <span>begins here.</span>
          </h1>

          <p>
            Create your Bus Reservation System account and make
            your next journey simple, comfortable,
            and stress-free.
          </p>

          <div className="register-benefits">

            <div>
              <span>✓</span>
              <div>
                <strong>Easy Bus Search</strong>
                <small>
                  Find buses by route and date.
                </small>
              </div>
            </div>

            <div>
              <span>✓</span>
              <div>
                <strong>Choose Your Seat</strong>
                <small>
                  Select your preferred seat.
                </small>
              </div>
            </div>

            <div>
              <span>✓</span>
              <div>
                <strong>Manage Bookings</strong>
                <small>
                  Access your tickets anytime.
                </small>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ================= RIGHT SIDE ================= */}

      <section className="register-form-section">

        <div className="register-form-wrapper">

          <div
            className="mobile-register-brand"
            onClick={() => navigate("/")}
          >
            <div>🚌</div>
            <span>Bus Reservation System</span>
          </div>

          <div className="register-heading">

            <span>GET STARTED</span>

            <h2>
              Create your account
            </h2>

            <p>
              Join Bus Reservation System and start travelling.
            </p>

          </div>

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* NAME */}

            <div className="register-field">

              <label>
                FULL NAME
              </label>

              <div className="register-input">

                <span>👤</span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="register-field">

              <label>
                EMAIL ADDRESS
              </label>

              <div className="register-input">

                <span>✉️</span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-field">

              <label>
                PASSWORD
              </label>

              <div className="register-input">

                <span>🔒</span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-field">

              <label>
                CONFIRM PASSWORD
              </label>

              <div className="register-input">

                <span>🔐</span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="register-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="register-success">
                <span>✓</span>
                {success}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="register-divider">
            <span></span>
            <small>OR</small>
            <span></span>
          </div>

          <div className="login-prompt">

            <span>
              Already have an account?
            </span>

            <button
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

          </div>

          <div className="register-security">
            🔒 Your account information is securely stored.
          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;