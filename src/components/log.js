import React, { useState } from "react";
import "../style/log.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    

    try {
      const response = await fetch("http://10.10.83.224:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Sign up successful! Please log in.");
        setIsLogin(true); // Switch to login form after successful sign up
      } else {
        alert(data.message || "Sign up failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during sign up.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      const response = await fetch("http://10.10.83.224:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store JWT in localStorage
        localStorage.setItem("token", data.token);  // Store token in localStorage

        alert("Login successful!");

        // Redirect to home page
        window.location.href = "/"; // Redirect to the home page after login
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className={`container ${!isLogin ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className={`form-container sign-up`}>
        <form className='create' onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <input type="text" name="fname" placeholder="First" required />
          <input type="text" name="lname" placeholder="Last" required />
          <input  type="email" name="email" placeholder="Email" required />
          <input  type="number" name="number" placeholder="Contact Number" required />
          <input  type="password" name="password" placeholder="Password" required />

          <button className="signin" type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className={`form-container sign-in`}>
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button className="signin1" type="submit">Sign In</button>
        </form>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">

            <button className="hidden1" id="login" onClick={handleFormSwitch}>
              SignIn
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <button className="hidden" id="register" onClick={handleFormSwitch}>
              SignUp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
