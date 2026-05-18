import { useEffect, useState } from 'react'

import StatsCard from '../components/StatsCard'
import CourseCard from '../components/CourseCard'

import api from '../services/api'

function Dashboard() {

  const [courses, setCourses] = useState([])



  const fetchCourses = async () => {

    try {

      const response = await api.get('/courses/')

      setCourses(response.data)

    } catch (error) {

      console.log(error)
    }
  }



  useEffect(() => {

    fetchCourses()

  }, [])

  let lessonsGeneratedCount = 0

let quizzesCreatedCount = 0



courses.forEach((course) => {

  course.modules.forEach((module) => {

    module.lessons.forEach((lesson) => {

      if (lesson.content) {

        lessonsGeneratedCount += 1
      }



      if (lesson.quizzes.length > 0) {

        quizzesCreatedCount += 1
      }

    })

  })

})



  return (
    <div>

      {/* Welcome Section */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your AI generated courses easily.
        </p>

      </div>



      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <StatsCard
          title="Total Courses"
          value={courses.length}
        />

        <StatsCard
          title="Lessons Generated"
          value={lessonsGeneratedCount}
        />

        <StatsCard
          title="Quizzes Created"
          value={quizzesCreatedCount}
        />

      </div>



      {/* Recent Courses */}

      <div>

        <h2 className="text-3xl font-bold mb-6">
          Your Courses
        </h2>



        {
          courses.length === 0 ? (

            <p className="text-gray-500">
              No courses created yet.
            </p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {
                courses.map((course) => (

                  <CourseCard
                    key={course.id}
                    course={course}

                  />

                ))
              }

            </div>

          )
        }

      </div>

    </div>
  )
}

export default Dashboard