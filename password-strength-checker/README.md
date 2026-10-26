# SecureCheck — Password Strength Checker

A responsive, browser-only password strength checker built with HTML, CSS, and vanilla JavaScript.

## Features

- Live password score and strength label
- Checks for length, character variety, common passwords, and obvious sequences
- Show/hide password and clear controls
- Responsive layout and accessible labels
- No backend, password uploads, local storage, or analytics

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Enter a **made-up test password**, not a password you use for a real account.

You can also run a local static server from this directory:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```text
password-strength-checker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How it works

- `index.html` contains the interface and accessible labels.
- `style.css` controls the responsive layout and visual design.
- `script.js` evaluates input locally and updates the score, checklist, and advice.

The score is a simple educational heuristic. It is **not** a cryptographic strength measurement, a guarantee that a password is safe, or a substitute for a password manager. The common-password list is intentionally small and is not a full breached-password database. For a more realistic estimator, consider integrating Dropbox's `zxcvbn` library and testing it carefully.

## Security notes

- Do not use real account passwords to demo this project.
- Do not add password logging, analytics, or server transmission.
- A production-grade strength checker should use a well-maintained estimator, and account systems should hash passwords server-side with a suitable password-hashing algorithm.
- Password strength is only one part of account security; use unique passwords and multi-factor authentication where available.

## Future improvements

- Integrate `zxcvbn` for a richer guessability estimate
- Add unit tests for the analysis function
- Add a password generator using `crypto.getRandomValues`
- Add a clear privacy/security section to the deployed site
