import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth"

export default function Signup() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const handleInputChange = (e) => {
    setError(null)
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { username, email, password } = formData
    if (!username || !email || !password) {
      setError("Please fill in all the fields.")
      setLoading(false)
      return
    }
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (data.success === false) {
      setError("Invalid Credentials!")
      setLoading(false)
      return
    }
    setLoading(false)
    setError(null)
    navigate("/sign-in")
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleInputChange}
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          onChange={handleInputChange}
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          onChange={handleInputChange}
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 font-semibold text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 text-center font-semibold">{error}</p>}
    </div>
  )
}
