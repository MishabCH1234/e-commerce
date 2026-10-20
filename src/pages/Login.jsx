import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
 


export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function handleSubmit(e) {
    e.preventDefault()

    if (!emailPattern.test(email) || password.length < 6) {
      setError('Please enter a valid email and password (at least 6 characters).')
      return
    }
    navigate('/home')
}
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}    
            className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300" />
            </div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
            </label>
            <input
              type="password"
              id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}   
            className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300" />
          <button
            type="submit"   
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleSubmit}  
            href="/home"
             >login</button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export default Login