import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function DashboardLayout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          <Outlet />

        </div>

      </div>

    </div>
  )
}

export default DashboardLayout