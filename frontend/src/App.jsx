import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateCourse from './pages/CreateCourse'

import DashboardLayout from './layouts/DashboardLayout'
import CourseDetails from './pages/CourseDetails'
import ProtectedRoute from './routes/ProtectedRoute'
import LessonDetails from './pages/LessonDetails'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />



        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          

          <Route
            path="/courses/:id"
            element={<CourseDetails />}
          />

          <Route
            path="/lessons/:id"
            element={<LessonDetails />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/create-course"
            element={<CreateCourse />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App