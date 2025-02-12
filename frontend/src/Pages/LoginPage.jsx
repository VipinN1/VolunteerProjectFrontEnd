import "./Login.css";

function LoginPage() {
  return (
   
    <>
      <div id="header_div"> {/* Add a header_div to all pages w/ "Volunteer Site" in it; don't have the buttons for any page except the account register one as the rest should require a user to be logged in*/}
        Volunteer Site
        <a href="/login/"><button id="login_button">Log In</button></a>
        <a href="/register/"><button id="register_button">Register</button></a>
      </div>
      
      <div id="body_div">
        <h1>Log Into Your Account</h1>
        <form id="login_form" action="/profile/">
            <p>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" size="15" required></input>
            </p>
            <p>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" size="15" required></input>
            </p>
            <p>
                <input type="submit" value="Login"></input>  {/* TODO: Figure out the major issue with freakin'... CSS SPILLOVER */}
            </p>
        </form>
        <section>
          <p id="register_msg">Not a member yet? <a href="/register/">Register</a></p> {/* Add a link to the account creation page here */}
        </section>
      </div>
      <div id="footer_div"></div>  {/* Add a footer_div to all pages w/ "Volunteer Site" in it */}
    </>
  )
}

export default LoginPage