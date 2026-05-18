import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import api from '../services/api'

function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const response = await api.post(
        '/users/login/',
        formData
      )

      localStorage.setItem(
        'access',
        response.data.access
      )

      localStorage.setItem(
        'refresh',
        response.data.refresh
      )

      alert('Login Successful')

      navigate('/dashboard')

    } catch (error) {

      console.log(error)

      alert('Invalid Credentials')

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Login
        </button>

        <p className="mt-4 text-center">

          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 ml-2"
          >
            Signup
          </Link>

        </p>

      </form>

    </div>
  )
}

export default Login