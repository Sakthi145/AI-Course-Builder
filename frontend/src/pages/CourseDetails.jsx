import { useEffect, useState } from 'react'

import { useParams, useNavigate, Link } from 'react-router-dom'

import api from '../services/api'

function CourseDetails() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [course, setCourse] = useState(null)

  const [editMode, setEditMode] = useState(false)

  const [topics, setTopics] = useState('')

  const [generatedSyllabus, setGeneratedSyllabus] = useState('')

  const [loading, setLoading] = useState(false)

  const [showGenerator, setShowGenerator] = useState(false)



  const fetchCourse = async () => {

    try {

      const response = await api.get(`/courses/${id}/`)

      setCourse(response.data)



      if (response.data.modules.length === 0) {

        setShowGenerator(true)

      } else {

        setShowGenerator(false)
      }

    } catch (error) {

      console.log(error)
    }
  }



  useEffect(() => {

    fetchCourse()

  }, [])



  const handleChange = (e) => {

    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    })
  }



  const handleUpdate = async () => {

    try {

      await api.put(`/courses/${id}/`, course)

      alert('Course Updated Successfully')

      setEditMode(false)

    } catch (error) {

      console.log(error)

      alert('Update Failed')
    }
  }



  const handleDelete = async () => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this course?'
    )

    if (!confirmDelete) return

    try {

      await api.delete(`/courses/${id}/`)

      alert('Course Deleted Successfully')

      navigate('/dashboard')

    } catch (error) {

      console.log(error)

      alert('Delete Failed')
    }
  }



  const handleGenerateSyllabus = async () => {

    setLoading(true)

    try {

      const response = await api.post(
        '/ai/generate-syllabus/',
        {
          title: course.title,
          level: course.level,
          duration: course.duration,
          topics: topics,
        }
      )

      setGeneratedSyllabus(
        response.data.content
      )

    } catch (error) {

      console.log(error)

      alert('Failed To Generate Syllabus')

    } finally {

      setLoading(false)
    }
  }



  const handleSaveSyllabus = async () => {

    try {

      await api.post(
        '/ai/save-syllabus/',
        {
          course_id: course.id,
          content: generatedSyllabus,
        }
      )

      alert('Syllabus Saved Successfully')

      setGeneratedSyllabus('')

      fetchCourse()

    } catch (error) {

      console.log(error)

      alert('Failed To Save Syllabus')
    }
  }



  if (!course) {

    return <p>Loading...</p>
  }



  return (

    <div className="max-w-4xl">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Course Details
        </h1>



        <div className="flex gap-3">

          <button
            onClick={() => {

              const newEditMode = !editMode

              setEditMode(newEditMode)



              if (newEditMode) {

                setShowGenerator(true)

              } else {

                if (course.modules.length > 0) {

                  setShowGenerator(false)
                }
              }
            }}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
          >

            {editMode ? 'Cancel' : 'Edit'}

          </button>



          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>



      {/* Course Details Card */}

      <div className="bg-white p-8 rounded-2xl shadow">

        {/* Title */}

        <div className="mb-6">

          <label className="block font-semibold mb-2">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border p-3 rounded-lg"
          />

        </div>



        {/* Description */}

        <div className="mb-6">

          <label className="block font-semibold mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            disabled={!editMode}
            rows="5"
            className="w-full border p-3 rounded-lg"
          />

        </div>



        {/* Level */}

        <div className="mb-6">

          <label className="block font-semibold mb-2">
            Level
          </label>

          <select
            name="level"
            value={course.level}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border p-3 rounded-lg"
          >

            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>

          </select>

        </div>



        {/* Duration */}

        <div className="mb-6">

          <label className="block font-semibold mb-2">
            Duration
          </label>

          <input
            type="text"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border p-3 rounded-lg"
          />

        </div>



        {
          editMode && (

            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Save Changes
            </button>

          )
        }

      </div>



      {/* AI Generator Section */}

      {
        showGenerator && (

          <div className="bg-white p-8 rounded-2xl shadow mt-10">

            <h2 className="text-3xl font-bold mb-6">
              AI Course Generator
            </h2>



            <textarea
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Enter topics like loops, functions, OOP..."
              rows="4"
              className="w-full border p-4 rounded-xl mb-5"
            />



            <button
              onClick={handleGenerateSyllabus}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >

              {
                loading
                ? 'Generating...'
                : 'Generate Complete Course'
              }

            </button>



            {
              generatedSyllabus && (

                <div className="mt-10">

                  <div className="flex gap-4 mb-5">

                    <button
                      onClick={handleSaveSyllabus}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    >
                      Save Course Content
                    </button>

                  </div>



                  <pre className="bg-gray-100 p-6 rounded-xl whitespace-pre-wrap leading-7 overflow-x-auto">
                    {generatedSyllabus}
                  </pre>

                </div>
              )
            }

          </div>
        )
      }



      {/* Modules Section */}

      <div className="bg-white p-8 rounded-2xl shadow mt-10">

        <h2 className="text-3xl font-bold mb-6">
          Course Modules
        </h2>



        {
          course.modules.length === 0 ? (

            <p className="text-gray-500">
              No modules generated yet.
            </p>

          ) : (

            <div className="space-y-4">

              {
                course.modules.map((module) => (

                  <div
                    key={module.id}
                    className="border p-5 rounded-xl"
                  >

                    <h3 className="text-xl font-bold">
                      Module {module.order}
                    </h3>



                    <p className="text-gray-700 mt-2 mb-5">
                      {module.title}
                    </p>



                    {/* Lessons */}

                    <div className="space-y-3">

                      {
                        module.lessons.map((lesson) => (

                          <Link
                            to={`/lessons/${lesson.id}`}
                            key={lesson.id}
                            className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition"
                          >

                            <p className="font-medium">
                              {lesson.title}
                            </p>

                          </Link>

                        ))
                      }

                    </div>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </div>
  )
}

export default CourseDetails