import "./Login.css";

function LoginPage( {handleLogin} ) {
  const login = (event) => {  // Placeholder! Make better later if time allows
    event.preventDefault();
    handleLogin(document.getElementById("username_log").value,document.getElementById("password_log").value);
  }

  return ( 
    <>
      <div classname="login-container">
        <title>Volunteer Site - Login</title>
        <a href="/login/"><button id="login_button_log">Log In</button></a>
        <a href="/register/"><button id="register_button_log">Register</button></a>
        
        <div id="body_div">
          <h1 id="login_h1">Log Into Your Account</h1>
          <form id="login_form" onSubmit={login}>
              <p id="login_p">
                  <label for="username_log">Username:</label>
                  <input type="text" id="username_log" name="username_log" size="15"></input>
              </p>
              <p id="login_p">
                  <label for="password_log">Password:</label>
                  <input type="password" id="password_log" name="password_log" size="15"></input>
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