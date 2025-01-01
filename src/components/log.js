import React, { useState } from "react";
import "../style/log.css"; // Include your styles here

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Track if login or sign up form is active

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={`container ${!isLogin ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className={`form-container sign-up`}>
        <form>
          <h1>Create Account</h1>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className={`form-container sign-in`}>
        <form>
          <h1>Sign In</h1>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <a href="#">Forgot Your Password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all site features</p>
            <button className="hidden" id="login" onClick={handleFormSwitch}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all site features</p>
            <button className="hidden" id="register" onClick={handleFormSwitch}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
