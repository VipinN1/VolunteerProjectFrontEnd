import "./Register.css";

function RegisterPage() {
  return (
    <>
      <div id="header_div"> {/* Add a header_div to all pages w/ "Volunteer Site" in it; don't have the buttons for any page except the account register one as the rest should require a user to be logged in*/}
        Volunteer Site
        <a href="/login/"><button id="login_button">Log In</button></a>
        <a href="/register/"><button id="register_button">Register</button></a>
      </div>
      
      <div id="body_div">
        <h1>Create your account!</h1>
        <form id="register_form" action="/profile/">
            <p>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" size="15" required></input>
            </p>
            <p>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" size="15" required></input>
            </p>
            <p>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" size="15" required></input>
            </p>
            <p>
              <input type="submit" value="Register"></input>
            </p>
        </form>
        <br></br>
      </div>
      
      <div id="footer_div"></div>  {/* Add a footer_div to all pages w/ "Volunteer Site" in it */}
    </>
  )
}

export default RegisterPage;