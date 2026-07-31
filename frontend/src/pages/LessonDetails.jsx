import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import ReactMarkdown from 'react-markdown'

import remarkGfm from 'remark-gfm'

import api from '../services/api'

function LessonDetails() {

  const { id } = useParams()

  const [lesson, setLesson] = useState(null)

  const [loading, setLoading] = useState(false)

  const [quizLoading, setQuizLoading] = useState(false)

  const [selectedAnswers, setSelectedAnswers] = useState({})

  const [showResults, setShowResults] = useState(false)

  const [showFullContent, setShowFullContent] = useState(true)

  const [note, setNote] = useState(null)

  const [noteContent, setNoteContent] = useState('')

  const [isEditingNote, setIsEditingNote] = useState(false)

  const [notesLoading, setNotesLoading] = useState(false)

  const [score, setScore] = useState(0)




  const fetchLesson = async () => {

    try {

      const response = await api.get(
        `/lessons/${id}/`
      )

      setLesson(response.data)

    } catch (error) {

      console.log(error)
    }
  }



  const fetchNotes = async () => {

    try {

      const response = await api.get(
        `/lessons/${id}/notes/`
      )

      setNote(response.data[0] || null)

    } catch (error) {

      console.log(error)
    }
  }



const fetchQuizAttempt = async () => {

  try {

    const response = await api.get(
      `/lessons/${id}/quiz-attempt/`
    )



    if (response.data.id) {

      setSelectedAnswers(
        response.data.selected_answers
      )

      setScore(response.data.score)

      setShowResults(true)
    }

  } catch (error) {

    console.log(error)
  }
}





  useEffect(() => {

    fetchLesson()

    fetchNotes()

    fetchQuizAttempt()

  }, [])



  const handleGenerateContent = async () => {

    setLoading(true)

    try {

      const response = await api.post(
        '/ai/generate-lesson-content/',
        {
          lesson_id: lesson.id
        }
      )

      setLesson({
        ...lesson,
        content: response.data.content
      })

    } catch (error) {

      console.log(error)

      alert('Failed To Generate Lesson')

    } finally {

      setLoading(false)
    }
  }



  const handleGenerateQuiz = async () => {

    setQuizLoading(true)

    try {

      await api.post(
        '/ai/generate-quiz/',
        {
          lesson_id: lesson.id
        }
      )

      fetchLesson()

      setShowFullContent(false)

    } catch (error) {

      console.log(error)

      alert('Failed To Generate Quiz')

    } finally {

      setQuizLoading(false)
    }
  }



  const handleSelectAnswer = (
    quizId,
    answer
  ) => {

    setSelectedAnswers({
      ...selectedAnswers,
      [quizId]: answer
    })
  }



  const handleSaveNote = async () => {

    setNotesLoading(true)

    try {

      if (note) {

        await api.put(
          `/notes/${note.id}/`,
          {
            content: noteContent
          }
        )

      } else {

        await api.post(
          `/lessons/${id}/notes/`,
          {
            content: noteContent
          }
        )
      }

      fetchNotes()

      setIsEditingNote(false)

    } catch (error) {

      console.log(error)

      alert('Failed To Save Note')

    } finally {

      setNotesLoading(false)
    }
  }



  const handleDeleteNote = async () => {

    try {

      await api.delete(
        `/notes/${note.id}/`
      )

      setNote(null)

      setNoteContent('')

      setIsEditingNote(false)

    } catch (error) {

      console.log(error)

      alert('Failed To Delete Note')
    }
  }


const handleSubmitQuiz = async () => {

  try {

    const response = await api.post(
      `/lessons/${id}/quiz-attempt/`,
      {
        selected_answers: selectedAnswers
      }
    )



    setScore(response.data.score)

    setShowResults(true)

  } catch (error) {

    console.log(error)

    alert('Failed To Submit Quiz')
  }
}




  if (!lesson) {

    return <p>Loading...</p>
  }



  return (

    <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6">

      {/* Lesson Section */}

      <div className="bg-white p-8 rounded-2xl shadow w-full">

        <h1 className="text-4xl font-bold mb-6">
          {lesson.title}
        </h1>



        <p className="text-gray-500 mb-8">
          Module: {lesson.module_title}
        </p>



        {
          !lesson.content && (

            <button
              onClick={handleGenerateContent}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl mb-6"
            >

              {
                loading
                  ? 'Generating...'
                  : 'Generate AI Lesson'
              }

            </button>

          )
        }



        <div
          onClick={() =>
            setShowFullContent(!showFullContent)
          }

          className={`
            bg-gray-100 p-6 rounded-xl cursor-pointer transition-all

            ${
              showFullContent
                ? ''
                : 'max-h-40 overflow-hidden'
            }
          `}
        >

          {
            lesson.content
              ? (
                <div className="prose prose-gray max-w-none prose-headings:font-bold prose-p:leading-8 prose-p:text-gray-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {lesson.content}
                  </ReactMarkdown>
                </div>
              )
              : (
                <p className="leading-8 text-gray-700">
                  Lesson content not generated yet.
                </p>
              )
          }

        </div>


{/* Quiz Section */}

<div className="mt-10">

  <div className="flex justify-between items-center mb-6">

    <h2 className="text-3xl font-bold">
      Quiz
    </h2>



    {
      lesson.quizzes.length === 0 && (

        <button
          onClick={handleGenerateQuiz}
          disabled={quizLoading}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl"
        >

          {
            quizLoading
              ? 'Generating...'
              : 'Generate AI Quiz'
          }

        </button>

      )
    }

  </div>



  {
    lesson.quizzes.length === 0 ? (

      <p className="text-gray-500">
        No quizzes generated yet.
      </p>

    ) : (

      <div className="space-y-8">

        {
          showResults && (

            <div className="bg-green-100 border border-green-400 p-6 rounded-xl">

              <h3 className="text-2xl font-bold text-green-700">

                Your Score: {score} / {lesson.quizzes.length}

              </h3>

            </div>

          )
        }



        {
          lesson.quizzes.map((quiz, index) => (

            <div
              key={quiz.id}
              className="border p-6 rounded-xl"
            >

              <h3 className="font-bold text-xl mb-5">

                Question {index + 1}

              </h3>



              <p className="mb-6">
                {quiz.question}
              </p>



              <div className="space-y-3">

                {
                  [
                    quiz.option1,
                    quiz.option2,
                    quiz.option3,
                    quiz.option4
                  ].map((option) => (

                    <button
                      key={option}

                      onClick={() => {

                        if (!showResults) {

                          handleSelectAnswer(
                            quiz.id,
                            option
                          )
                        }
                      }}

                      className={`block w-full text-left p-4 rounded-lg border transition

                        ${
                          showResults

                            ? selectedAnswers[quiz.id] === option

                              ? option === quiz.correct_answer

                                ? 'bg-green-200 border-green-500'

                                : 'bg-red-200 border-red-500'

                              : 'bg-white'

                            : selectedAnswers[quiz.id] === option

                              ? 'bg-blue-100 border-blue-500'

                              : 'bg-white'
                        }`}
                    >

                      {option}

                    </button>

                  ))
                }

              </div>



              {
                showResults && (

                  <div className="mt-5">

                    <p className="font-semibold text-green-600">

                      Correct Answer:
                      {' '}
                      {quiz.correct_answer}

                    </p>



                    <p className="mt-2 text-gray-700">

                      {quiz.explanation}

                    </p>

                  </div>

                )
              }

            </div>

          ))
        }



        <div className="flex gap-4">

          {
            !showResults && (

              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 text-white px-6 py-3 rounded-xl"
              >

                Submit Quiz

              </button>

            )
          }



          {
            showResults && (

              <button
                onClick={async () => {

  try {

    await api.delete(
      `/lessons/${id}/quiz-attempt/`
    )

    setSelectedAnswers({})

    setShowResults(false)

    setScore(0)

  } catch (error) {

    console.log(error)

    alert('Failed To Retake Quiz')
  }
}}

                className="bg-orange-500 text-white px-6 py-3 rounded-xl"
              >

                Retake Quiz

              </button>

            )
          }

        </div>

      </div>

    )
  }

</div>


      </div>

{/* Notes Section */}

<div className="bg-white p-8 rounded-2xl shadow w-full h-fit sticky top-6">

  {/* Initial Compact Notes Header */}

  {
    !isEditingNote && (

      <div className="flex items-center justify-between border rounded-xl p-5 mb-6">

        <h2 className="text-2xl font-bold">
          Notes
        </h2>



        {
          !note && (

            <button
              onClick={() => {

                setIsEditingNote(true)

                setNoteContent('')
              }}

              className="bg-blue-600 text-white px-5 py-2 rounded-xl"
            >

              Take Notes

            </button>

          )
        }

      </div>

    )
  }



  {/* Notes Editor */}

  {
    isEditingNote && (

      <div>

        <textarea
          value={noteContent}

          onChange={(e) =>
            setNoteContent(e.target.value)
          }

          placeholder="Write your notes here..."

          rows="18"

          className="w-full border rounded-xl p-4 outline-none resize-none overflow-y-auto"
        />



        <div className="flex gap-4 mt-4">

          <button
            onClick={handleSaveNote}

            disabled={notesLoading}

            className="bg-green-600 text-white px-6 py-3 rounded-xl"
          >

            {
              notesLoading
                ? 'Saving...'
                : 'Save'
            }

          </button>



          <button
            onClick={() => {

              setIsEditingNote(false)

              setNoteContent(
                note ? note.content : ''
              )
            }}

            className="bg-gray-400 text-white px-6 py-3 rounded-xl"
          >

            Cancel

          </button>

        </div>

      </div>

    )
  }



  {/* Saved Note */}

  {
    note && !isEditingNote && (

      <div>

        <div className="bg-gray-100 p-6 rounded-xl max-h-[600px] overflow-y-auto">

          <div className="prose prose-gray max-w-none prose-p:leading-8 prose-p:text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>

        </div>



        <div className="flex gap-4 mt-6">

          <button
            onClick={() => {

              setIsEditingNote(true)

              setNoteContent(note.content)
            }}

            className="bg-yellow-500 text-white px-6 py-3 rounded-xl"
          >

            Edit

          </button>



          <button
            onClick={handleDeleteNote}

            className="bg-red-600 text-white px-6 py-3 rounded-xl"
          >

            Delete

          </button>

        </div>

      </div>

    )
  }

</div>

    

    </div>
  )
}

export default LessonDetails