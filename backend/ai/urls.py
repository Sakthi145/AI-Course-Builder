from django.urls import path

from .views import (generate_syllabus, save_syllabus, generate_lesson_content, generate_quiz)

urlpatterns = [
    path(
        'generate-syllabus/',
        generate_syllabus
    ),

    path(
        'save-syllabus/',
        save_syllabus
    ),

    path(
        'generate-lesson-content/',
        generate_lesson_content
    ),

    path(
        'generate-quiz/',
        generate_quiz
    ),
]