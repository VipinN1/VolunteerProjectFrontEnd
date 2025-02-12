import "./Login.css";
function LoginPage() {
  return (
   
    <>
      <div id="header_div"> {/* Add a header_div to all pages w/ "Volunteer Site" in it; don't have the buttons for any page except the account register one as the rest should require a user to be logged in*/}
        Volunteer Site
        <button id="login_button">Log In</button>
        <button id="register_button">Register</button>
      </div>
      
      <div>
        <h1>Log Into Your Account</h1>
        <p>
          <label for="username">Username </label>
          <input type="text" id="username" name="username" size="15" required></input>
        </p>
        <p>
          <label for="password">Password </label>
          <input type="password" id="password" name="password" size="15" required></input>
        </p>
        <p>
          <input type="submit" value="Login"></input> {/* Add a link to one of the other pages here*/}
        </p>
        <section>
          <p>Not a member yet? <a>Register</a></p> {/* Add a link to the account creation page here */}
        </section>
      </div>
      <div id="footer_div"></div>  {/* Add a footer_div to all pages w/ "Volunteer Site" in it */}
    </>
  )
}

export default LoginPage