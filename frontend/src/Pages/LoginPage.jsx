import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./Login.css";

function LoginPage( {handleLogin} ) {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleLogChange = (e) => {
    const {name, value} = e.target;
    setLoginData((prev) => ({...prev, [name]:value}));
  }

  const handleLogSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (response.status !== 200) { 
        throw new Error(result.message);
      }
      console.log("Login successful:", result);
      sessionStorage.removeItem("auth-token");
      sessionStorage.removeItem("role-token");
      sessionStorage.setItem("auth-token", result.userID);
      sessionStorage.setItem("role-token", result.role);
      window.dispatchEvent(new Event("role-token-changed"));
      navigate("/profile/");
      alert("Login successful!",result.role);
    } catch(error) {
      console.error("Error logging in:", error);
      alert("Failed to log in.");
    }
  }
  

  /*const login = (event) => {  // Placeholder! Make better later if time allows
    event.preventDefault();
    handleLogin(document.getElementById("username_log").value,document.getElementById("password_log").value);
  }*/

  return ( 
    <>
      <div classname="login-container">
        <title>Volunteer Site - Login</title>
        
        <div id="body_div">
          <h1 id="login_h1">Log Into Your Account</h1>
          <form id="login_form" onSubmit={handleLogSubmit}>
              <p id="login_p">
                  <label for="username_log">Username:</label>
                  <input type="text" id="username_log" name="username" onChange={handleLogChange} size="15"></input>
              </p>
              <p id="login_p">
                  <label for="password_log">Password:</label>
                  <input type="password" id="password_log" name="password" onChange={handleLogChange} size="15"></input>
              </p>
              <p id="login_p">
                  <button type="submit" value="Login" onClick={console.log("button clicked")}>Login</button>  {/* TODO: Figure out the major issue with freakin'... CSS SPILLOVER */}
              </p>
          </form>
          <section id="msg_section">
            <p id="forgot_msg"><a href="/forgotpassword/">Forgot your password?</a></p> {/* Add a link to the account creation page here */}
            <p id="register_msg">Not a member yet? <a href="/register/">Register</a></p> {/* Add a link to the account creation page here */}
          </section>
        </div>
      </div>
    </>
  )
}

export default LoginPage