import { useState } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm Bus Reservation System AI. How can I help you?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            history: messages.slice(-10),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "AI request failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry 😕 AI se connection nahi ho pa raha. Backend check karo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {!open && (
        <button
          className="chatbot-floating-button"
          onClick={() => setOpen(true)}
        >
          🤖
        </button>
      )}

      {open && (
        <div className="chatbot-window">

          <div className="chatbot-header">
            <div>
              <strong>🤖 Bus Reservation System AI</strong>
              <span>● Online</span>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.role === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="chat-message bot-message">
                Typing...
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask Bus Reservation System AI..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default ChatBot;