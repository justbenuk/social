import Page from "../layout/Page"
import { useState } from "react"
import { Link } from "react-router-dom"
function Login() {

  const INITIALSTATE = {
    password: '',
    email: '',
  }

  const [formData, setFormData] = useState(INITIALSTATE)

  const { email, password } = formData

  function handleChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

  }

  return (
    <Page>
      <h1 className="large text-primary">Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} onChange={handleChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Page>
  )
}


export default Login
