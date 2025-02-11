import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="header_div">
        Volunteer Site
      </div>
      <h1>User Login</h1>
      <p>
        <label for="username">Username </label>
        <input type="text" id="username" name="username" size="10" required></input>
      </p>
      <p>
        <label for="password">Password </label>
        <input type="password" id="password" name="password" size="10" required></input>
      </p>
      <p>
        <input type="submit" value="Login"></input> {/* Add a link to one of the other pages here*/}
      </p>
      <section>
        <p>Not a member yet? <a>Register</a></p> {/* Add a link to the account creation page here */}
      </section>
    </>
  )
}

export default App
