import "./ForgotPassword.css";

function ForgotPassword() {
    return (
     
      <>
        <div classname="fpassword-container">
          <title>Volunteer Site - Forgot Password</title>
          
          <div id="body_div">
            <h1 id="forgot_h1">Forgot Your Password?</h1>
            <form id="forgot_form" action="/resetpassword/">
                <p id="forgot_p">
                    <label for="email_forgot">Email:</label>
                    <input type="email" id="email_forgot" name="email_forgot" size="15" required></input>
                </p>
                <p id="forgot_p">
                  <button type="submit" value="Send Email">Send Email</button>  {/* TODO: Figure out the major issue with freakin'... CSS SPILLOVER */}
                </p>
            </form>
          </div>
        </div>
      </>
    )
  }
  
  export default ForgotPassword;