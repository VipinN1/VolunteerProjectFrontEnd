import "./Register.css";

function RegisterPage( {handleRegister} ) {
  const register = (event) => {
    event.preventDefault();
    handleRegister(document.getElementById("email").value, document.getElementById("username").value, document.getElementById("password").value);
  };

  return (
    <>
      <div classname="register-container">
        <title>Volunteer Site - Register</title>
        <a href="/login/"><button id="login_button_reg">Log In</button></a>
        <a href="/register/"><button id="register_button_reg">Register</button></a>
        
        <div id="body_div_reg">
          <h1 id="register_h1">Create your account!</h1>
          <form id="register_form" action="/profile/">
              <p>
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" size="15" required onChange={(e)=>{setEmailReg(e.target.value);}}></input>
              </p>
              <p>
                  <label for="username">Username:</label>
                  <input type="text" id="username" name="username" size="15" required onChange={(e)=>{setUsernameReg(e.target.value);}}></input>
              </p>
              <p>
                  <label for="password">Password:</label>
                  <input type="password" id="password" name="password" size="15" required onChange={(e)=>{setPasswordReg(e.target.value);}}></input>
              </p>
              <p>
                <button id="register_button" type="submit" value="Register" onClick={(register)}>Register</button>
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