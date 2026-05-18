from django.urls import path

from .views import (
    courses_list_create,
    course_detail,
    LessonDetailView,
    note_detail,
    notes_content,
    quiz_attempt
)

urlpatterns = [
    path('courses/', courses_list_create),

    path('courses/<int:pk>/', course_detail),

    path(
    'lessons/<int:pk>/',
    LessonDetailView.as_view()
),
    path('notes/<int:note_id>/', note_detail, name='note-detail'),
    path('lessons/<int:lesson_id>/notes/', notes_content, name='notes-content'),
    path('lessons/<int:lesson_id>/quiz-attempt/', quiz_attempt, name='quiz-attempt'),
]