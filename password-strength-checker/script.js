const passwordInput = document.querySelector("#password");
const toggleButton = document.querySelector("#toggle-password");
const clearButton = document.querySelector("#clear");
const strengthLabel = document.querySelector("#strength-label");
const scoreElement = document.querySelector("#score");
const meter = document.querySelector("#meter");
const meterFill = document.querySelector("#meter-fill");
const adviceTitle = document.querySelector("#advice-title");
const adviceText = document.querySelector("#advice-text");

// This small local list catches examples of very common passwords.
// It is not a complete leaked-password database.
const commonPasswords = new Set([
  "password", "password123", "123456", "123456789", "12345678",
  "qwerty", "qwerty123", "admin", "letmein", "welcome",
  "iloveyou", "abc123", "111111", "000000", "changeme"
]);

function analyzePassword(password) {
  const checks = {
    length: password.length >= 12,
    long: password.length >= 16,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    common: !commonPasswords.has(password.toLowerCase()),
    pattern: !hasObviousPattern(password)
  };

  if (!password) {
    return { score: 0, label: "Waiting for input", checks, adviceTitle: "Start with length",
      adviceText: "A long, unique passphrase is often easier to remember and harder to guess than a short, complicated password." };
  }

  // Heuristic score for learning purposes, not a cryptographic estimate.
  let score = 0;
  score += Math.min(password.length * 3, 48);
  score += checks.lower ? 7 : 0;
  score += checks.upper ? 7 : 0;
  score += checks.number ? 7 : 0;
  score += checks.symbol ? 9 : 0;
  score += checks.long ? 10 : 0;
  score -= checks.common ? 0 : 35;
  score -= checks.pattern ? 0 : 15;
  if (/(.)\1{2,}/.test(password)) score -= 10;
  score = Math.max(0, Math.min(100, score));

  let label;
  if (!checks.common || !checks.pattern || password.length < 8) label = "Very weak";
  else if (score < 35) label = "Weak";
  else if (score < 55) label = "Fair";
  else if (score < 75) label = "Strong";
  else label = "Very strong";

  let adviceTitle = "Good progress";
  let adviceText = "Use this as a guide only. Make sure the password is unique to one account.";
  if (!checks.common) {
    adviceTitle = "Avoid common passwords";
    adviceText = "This matches a commonly used password in the checker's small built-in list. Choose a completely different phrase.";
  } else if (password.length < 12) {
    adviceTitle = "Add more length";
    adviceText = "Aim for at least 12–16 characters. A longer, unique passphrase is often a better choice.";
  } else if (!checks.pattern) {
    adviceTitle = "Avoid predictable patterns";
    adviceText = "Sequences such as 12345 or abcde are easy to guess. Use unrelated words or randomly generated characters instead.";
  } else if (!checks.long) {
    adviceTitle = "Consider going longer";
    adviceText = "You're on the right track. Try 16 or more characters and keep the password unique.";
  } else if (!(checks.lower && checks.upper && checks.number && checks.symbol)) {
    adviceTitle = "Add variety if useful";
    adviceText = "Varied character types can help, but length, uniqueness, and avoiding guessable information matter more than symbol rules alone.";
  }

  return { score, label, checks, adviceTitle, adviceText };
}

function hasObviousPattern(password) {
  const lower = password.toLowerCase();
  const sequences = [
    "0123456789", "9876543210", "abcdefghijklmnopqrstuvwxyz",
    "qwertyuiop", "asdfghjkl", "zxcvbnm"
  ];

  for (const sequence of sequences) {
    for (let length = 4; length <= sequence.length; length++) {
      for (let start = 0; start <= sequence.length - length; start++) {
        if (lower.includes(sequence.slice(start, start + length))) return true;
      }
    }
  }
  return false;
}

function render() {
  const result = analyzePassword(passwordInput.value);

  strengthLabel.textContent = result.label;
  scoreElement.textContent = String(result.score);
  meterFill.style.width = `${result.score}%`;
  meter.setAttribute("aria-valuenow", String(result.score));

  const colors = {
    "Waiting for input": "#46536a",
    "Very weak": "var(--red)",
    "Weak": "var(--orange)",
    "Fair": "var(--yellow)",
    "Strong": "var(--green)",
    "Very strong": "var(--accent)"
  };
  meterFill.style.background = colors[result.label] || "var(--accent)";

  document.querySelectorAll("[data-check]").forEach((item) => {
    const key = item.dataset.check;
    const passed = result.checks[key];
    item.classList.toggle("pass", Boolean(passed));
    item.querySelector(".check-icon").textContent = passed ? "✓" : "○";
  });

  adviceTitle.textContent = result.adviceTitle;
  adviceText.textContent = result.adviceText;
}

passwordInput.addEventListener("input", render);

toggleButton.addEventListener("click", () => {
  const showing = passwordInput.type === "password";
  passwordInput.type = showing ? "text" : "password";
  toggleButton.textContent = showing ? "Hide" : "Show";
  toggleButton.setAttribute("aria-pressed", String(showing));
  passwordInput.focus();
});

clearButton.addEventListener("click", () => {
  passwordInput.value = "";
  passwordInput.type = "password";
  toggleButton.textContent = "Show";
  toggleButton.setAttribute("aria-pressed", "false");
  render();
  passwordInput.focus();
});

render();
