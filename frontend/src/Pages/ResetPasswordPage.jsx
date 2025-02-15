import "./ResetPassword.css";

function ResetPassword() {
    return (
     
      <>
        <div classname="rpassword-container">
          <title>Volunteer Site - Reset Password</title>
          
          <div id="body_div">
            <h1 id="reset_h1">Reset Your Password</h1>
            <form id="reset_form" action="/login/">
                <p id="reset_p">
                    <label for="new_password_reset">New Password:</label>
                    <input type="password" id="new_password_reset" name="new_password_reset" size="15" required></input>
                </p>
                <p id="reset_p">
                    <label for="reenter_password_reset">Reenter New Password:</label>
                    <input type="password" id="reenter_password_reset" name="reenter_password_reset" size="15" required></input>
                </p>
                <p id="reset_p">
                    <button type="submit" value="Reset Password">Reset Password</button>  {/* TODO: Figure out the major issue with freakin'... CSS SPILLOVER */}
                </p>
            </form>
          </div>
        </div>
      </>
    )
  }
  
  export default ResetPassword;