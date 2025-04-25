import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./Register.css";

function RegisterPage( {handleRegister} ) {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
      username: "",
      password: "",
      email: "",
    });
  
    const handleRegChange = (e) => {
      const {name, value} = e.target;
      setRegisterData((prev) => ({...prev, [name]:value}));
    }
  
    const handleRegSubmit = async(e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
        });
        const result = await response.json();
        if (response.status != 201) {
          throw new Error(result);
        }
        console.log("Registration successful:",result);
        navigate("/login/");
        alert("Registration successful! Please log in using your new credentials.");
      } catch(error) {
        console.error("Error registering:",error);
        alert("Failed to register.");
      }
    }

  const register = (event) => {
    event.preventDefault();
    handleRegister(document.getElementById("email").value, document.getElementById("username").value, document.getElementById("password").value);
  };

  return (
    <>
      <div classname="register-container">
        <title>Volunteer Site - Register</title>
        
        <div id="body_div_reg">
          <h1 id="register_h1">Create your account!</h1>
          <form id="register_form" onSubmit={handleRegSubmit}>
              <p>
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" size="15" required value={registerData.email} onChange={handleRegChange}></input>
              </p>
              <p>
                  <label for="username">Username:</label>
                  <input type="text" id="username" name="username" size="15" required value={registerData.username} onChange={handleRegChange}></input>
              </p>
              <p>
                  <label for="password">Password:</label>
                  <input type="password" id="password" name="password" size="15" required value={registerData.password} onChange={handleRegChange}></input>
              </p>
              <p>
                <button id="register_button" type="submit" value="Register">Register</button>
              </p>
          </form>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
      
    </>
  )
}

export default RegisterPage;