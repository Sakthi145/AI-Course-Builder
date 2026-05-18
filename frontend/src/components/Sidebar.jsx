import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">

      <h2 className="text-2xl font-bold mb-10">
        Dashboard
      </h2>

      <div className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Home
        </Link>

        <Link
          to="/create-course"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Create Course
        </Link>

       

      </div>

    </div>
  )
}

export default Sidebar