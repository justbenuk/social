import Page from "../layout/Page"
import { useState } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { setAlert } from "../../actions/alert"
function Register(props) {

  const INITIALSTATE = {
    name: '',
    password: '',
    email: '',
    confirmPassword: '',
  }

  const [formData, setFormData] = useState(INITIALSTATE)

  const { name, email, password, confirmPassword } = formData

  function handleChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      props.setAlert('your passwords dont match', 'danger')
    } else {
      console.log('success')
    }
  }

  return (
    <Page>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" required value={name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={handleChange} />
          <small className="form-text"
          >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            minLength="6"
            value={confirmPassword} onChange={handleChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Page>
  )
}

export default connect(null, { setAlert })(Register)
