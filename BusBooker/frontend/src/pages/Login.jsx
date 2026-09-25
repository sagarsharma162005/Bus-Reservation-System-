import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      localStorage.setItem(
        "busbookerToken",
        data.token
      );

      localStorage.setItem(
        "busbookerUser",
        JSON.stringify(data.user)
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <section className="login-visual">

        <div className="login-visual-overlay"></div>

        <div
          className="login-back"
          onClick={() => navigate("/")}
        >
          ← Back to home
        </div>

        <div className="login-visual-content">

          <div className="login-visual-badge">
            ✦ TRAVEL MADE SIMPLE
          </div>

          <h1>
            Every journey
            <br />
            <span>starts here.</span>
          </h1>

          <p>
            Book your bus, choose your seat,
            and travel with confidence.
          </p>

          <div className="login-visual-stats">

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

      </section>

      {/* RIGHT SIDE */}

      <section className="login-form-section">

        <div className="login-form-wrapper">

          <div
            className="mobile-login-brand"
            onClick={() => navigate("/")}
          >
            <div>🚌</div>
            <span>Bus Reservation System</span>
          </div>

          <div className="login-heading">

            <span>WELCOME BACK</span>

            <h2>
              Sign in to Bus Reservation System
            </h2>

            <p>
              Continue your journey with us.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <div className="login-field">

              <label>
                EMAIL ADDRESS
              </label>

              <div className="login-input">

                <span>✉️</span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <label>
                PASSWORD
              </label>

              <div className="login-input">

                <span>🔒</span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="login-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* LOGIN */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && (
                <span>→</span>
              )}
            </button>

          </form>

          <div className="login-divider">
            <span></span>
            <small>OR</small>
            <span></span>
          </div>

          <div className="register-prompt">

            <span>
              Don't have an account?
            </span>

            <button
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>

          </div>

          <div className="login-security">
            🔒 Secure login · Your information is protected
          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;