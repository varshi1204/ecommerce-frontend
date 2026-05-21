// 🔥 Firebase SDK imports (v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔐 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2WZTzn1NU8yNm4hmHt_YLpaKzAEVZjVQ",
  authDomain: "myecommerceapp-a6ee7.firebaseapp.com",
  projectId: "myecommerceapp-a6ee7",
  storageBucket: "myecommerceapp-a6ee7.appspot.com",
  messagingSenderId: "653639372126",
  appId: "1:653639372126:web:3150c857e3b02cedd6d3cf"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("🔥 Firebase initialized");

// ======================================================
// 📝 SIGN UP
// ======================================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const submitBtn = signupForm.querySelector("button");

    submitBtn.disabled = true;
    submitBtn.textContent = "Loading...";

    const name =
      document.getElementById("signupName")?.value.trim();

    const email =
      document.getElementById("signupEmail")?.value.trim();

    const password =
      document.getElementById("signupPassword")?.value;

    const confirmPassword =
      document.getElementById("signupConfirmPassword")?.value;

    const errorEl =
      document.getElementById("signupError");

    if (errorEl) errorEl.textContent = "";

    // ✅ Validation

    if (!name || !email || !password || !confirmPassword) {

      submitBtn.disabled = false;
      submitBtn.textContent = "Sign Up";

      errorEl.textContent = "All fields are required.";
      return;
    }

    if (password !== confirmPassword) {

      submitBtn.disabled = false;
      submitBtn.textContent = "Sign Up";

      errorEl.textContent = "Passwords do not match.";
      return;
    }

    if (!isStrongPassword(password)) {

      submitBtn.disabled = false;
      submitBtn.textContent = "Sign Up";

      errorEl.textContent =
        "Password must be at least 8 characters and include uppercase, lowercase and a number.";

      return;
    }

    // ✅ Firebase Signup

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      // ✅ Save display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      console.log("✅ User created:", userCredential.user);

      submitBtn.disabled = false;
      submitBtn.textContent = "Sign Up";

      alert("✅ Account created successfully!");

      window.location.href = "login.html";

    } catch (err) {

      console.error("Signup error:", err);

      submitBtn.disabled = false;
      submitBtn.textContent = "Sign Up";

      errorEl.textContent = getErrorMessage(err.code);
    }
  });
}

// ======================================================
// 🔑 LOGIN
// ======================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const submitBtn = loginForm.querySelector("button");

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    const email =
      document.getElementById("loginEmail")?.value.trim();

    const password =
      document.getElementById("loginPassword")?.value;

    const errorEl =
      document.getElementById("loginError");

    if (errorEl) errorEl.textContent = "";

    // ✅ Validation

    if (!email || !password) {

      submitBtn.disabled = false;
      submitBtn.textContent = "Login";

      errorEl.textContent =
        "Email and password are required.";

      return;
    }

    // ✅ Firebase Login

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log("✅ LOGIN SUCCESS");
      console.log(userCredential.user);

      submitBtn.disabled = false;
      submitBtn.textContent = "Login";

      alert("✅ Login successful!");

      window.location.href = "index.html";

    } catch (err) {

      console.error("Login error:", err);

      submitBtn.disabled = false;
      submitBtn.textContent = "Login";

      errorEl.textContent = getErrorMessage(err.code);
    }
  });
}

// ======================================================
// 🔄 AUTH STATE
// ======================================================

onAuthStateChanged(auth, (user) => {

  const loginLink =
    document.getElementById("loginLink");

  const logoutBtn =
    document.getElementById("logoutBtn");

  if (user) {

    console.log("👤 Logged in:", user.email);

    if (loginLink)
      loginLink.style.display = "none";

    if (logoutBtn)
      logoutBtn.style.display = "inline-block";

  } else {

    console.log("🚫 No user logged in");

    if (loginLink)
      loginLink.style.display = "inline-block";

    if (logoutBtn)
      logoutBtn.style.display = "none";
  }
});

// ======================================================
// 🚪 LOGOUT
// ======================================================

const logoutBtn =
  document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    try {

      await signOut(auth);

      alert("👋 Logged out successfully");

      window.location.href = "login.html";

    } catch (err) {

      console.error("Logout failed:", err);
    }
  });
}

// ======================================================
// 🧰 HELPERS
// ======================================================

function isStrongPassword(password) {

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

function getErrorMessage(code) {

  switch (code) {

    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/weak-password":
      return "Password is too weak.";

    case "auth/operation-not-allowed":
      return "Email/Password sign-in is disabled in Firebase.";

    default:
      return "Something went wrong. Please try again.";
  }
}

// ======================================================
// 👁️ TOGGLE PASSWORD VISIBILITY
// ======================================================

document.addEventListener("click", (e) => {

  if (e.target.classList.contains("toggle-password")) {

    const inputId =
      e.target.getAttribute("data-target");

    const input =
      document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {

      input.type = "text";
      e.target.textContent = "🙈";

    } else {

      input.type = "password";
      e.target.textContent = "👁";
    }
  }
});