import { useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()

  const handleLogout = () => {

    localStorage.removeItem('access')

    localStorage.removeItem('refresh')

    navigate('/login')
  }

  return (

    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-blue-600">
        AI Course Builder
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>

    </div>
  )
}

export default Navbar