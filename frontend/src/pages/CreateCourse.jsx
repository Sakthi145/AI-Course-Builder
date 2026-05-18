import { useState } from 'react'

import api from '../services/api'

function CreateCourse() {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    duration: '',
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

      await api.post('/courses/', formData)

      alert('Course Created Successfully')

      setFormData({
        title: '',
        description: '',
        level: 'Beginner',
        duration: '',
      })

    } catch (error) {

      console.log(error)

      alert('Failed To Create Course')
    }
  }



  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Create New Course
      </h1>



      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-2xl"
      >

        {/* Title */}

        <div className="mb-5">

          <label className="block mb-2 font-semibold">
            Course Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            placeholder="Enter course title"
          />

        </div>



        {/* Description */}

        <div className="mb-5">

          <label className="block mb-2 font-semibold">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            rows="5"
            placeholder="Enter course description"
          />

        </div>



        {/* Level */}

        <div className="mb-5">

          <label className="block mb-2 font-semibold">
            Skill Level
          </label>

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
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

        <div className="mb-5">

          <label className="block mb-2 font-semibold">
            Duration
          </label>

          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            placeholder="Example: 4 Weeks"
          />

        </div>



        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Create Course
        </button>

      </form>

    </div>
  )
}

export default CreateCourse