import { Link } from 'react-router-dom'

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`}>

      <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">

        <h2 className="text-2xl font-bold mb-2">
          {course.title}
        </h2>

        <p className="text-gray-600 mb-4">
          {course.description}
        </p>

        <div className="flex justify-between items-center">

          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
            {course.level}
          </span>

          <span className="text-gray-500">
            {course.duration}
          </span>

        </div>

      </div>

    </Link>
  )
}

export default CourseCard