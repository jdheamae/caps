import React, { useState } from "react";
import "..//style/log.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

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
      setLoading(false); // Hide loading animation

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
    setLoading(true); // Show loading animation
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://10.10.83.224:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false); // Hide loading animation

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
    <>
      {/* Loading Animation */}
      {loading && (
        <div className="loading-overlay">
          <img src="/load.gif" alt="Loading..." className="loading-gif" />
        </div>
      )}
      
      <div className={`container ${!isLogin ? "active" : ""}`} id="container">
        {/* Sign Up Form */}
        <div className={`form-container sign-up`}>
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="number" name="email" placeholder="Contact Number" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`form-container sign-in`}>
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
            <img 
                src="firigif.gif" 
                alt="Welcome GIF" 
                className="welcome-gifleft"
              />
            <img 
                src="firi2.png" 
                alt="Welcome GIF" 
                className="welcome-gif1left"
              />
              <div className="churva"> 
              <p>Join FIRI – Find It, Retrieve It!
                <br></br>
                <br></br>
                Sign up to report, track, and reclaim lost items with ease! 🔍✨ </p>
              </div>

              <button className="hidden1" id="login" onClick={handleFormSwitch}>
                SignIn
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <img 
                src="firigif.gif" 
                alt="Welcome GIF" 
                className="welcome-gif"
              />
            <img 
                src="firi.png" 
                alt="Welcome GIF" 
                className="welcome-gif1"
              />
              <p>Welcome to FIRI – Find It, Retrieve It!
                <br></br>
                <br></br>
                Easily report lost and found items. Let’s help reunite valuables with their owners! 🔍✨
                </p>
              <button className="hidden" id="register" onClick={handleFormSwitch}>
                SignUp
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;