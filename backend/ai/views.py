import os
import json

from google import genai

from courses.models import (
    Course,
    Module,
    Lesson,
    Quiz,
)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes



client = genai.Client(
    api_key=os.getenv('GEMINI_API_KEY')
)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_syllabus(request):

    title = request.data.get('title')

    level = request.data.get('level')

    duration = request.data.get('duration')

    topics = request.data.get('topics')



    prompt = f"""
    
    Generate a complete course structure in JSON format only.

    Course Title: {title}

    Skill Level: {level}

    Duration: {duration}

    Topics: {topics}

    Return ONLY valid JSON.

    Format:

    {{
      "modules": [
        {{
          "title": "Module Title",
          "lessons": [
            {{
              "title": "Lesson Title"
            }}
          ]
        }}
      ]
    }}

    Generate:
    - 4 modules
    - 3 lessons per module

    Do not return explanations.
    Do not return markdown.
    Do not wrap in ```json.
    """



    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )



    return Response({
        'content': response.text
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_syllabus(request):

    course_id = request.data.get('course_id')

    content = request.data.get('content')



    try:

        course = Course.objects.get(
            id=course_id,
            user=request.user
        )

    except Course.DoesNotExist:

        return Response({
            'error': 'Course not found'
        })



    try:

        parsed_data = json.loads(content)

    except json.JSONDecodeError:

        return Response({
            'error': 'Invalid JSON from AI'
        })



    # Delete old modules and lessons

    course.modules.all().delete()



    modules = parsed_data.get('modules', [])



    for module_index, module_data in enumerate(modules):

        module = Module.objects.create(
            course=course,
            title=module_data['title'],
            order=module_index + 1
        )



        lessons = module_data.get('lessons', [])



        for lesson_index, lesson_data in enumerate(lessons):

            Lesson.objects.create(
                module=module,
                title=lesson_data['title'],
                order=lesson_index + 1
            )



    return Response({
        'message': 'Course content saved successfully'
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_lesson_content(request):

    lesson_id = request.data.get('lesson_id')



    try:

        lesson = Lesson.objects.get(
            id=lesson_id,
            module__course__user=request.user
        )

    except Lesson.DoesNotExist:

        return Response({
            'error': 'Lesson not found'
        })



    prompt = f"""

    Generate detailed learning content for this lesson.

    Lesson Title:
    {lesson.title}

    Return:

    1. Simple explanation
    2. Real-world examples
    3. Exercises for practice

    Make the content beginner friendly.

    """



    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )



    lesson.content = response.text

    lesson.save()



    return Response({
        'message': 'Lesson content generated',
        'content': lesson.content
    })




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):

    lesson_id = request.data.get('lesson_id')



    try:

        lesson = Lesson.objects.get(
            id=lesson_id,
            module__course__user=request.user
        )

    except Lesson.DoesNotExist:

        return Response({
            'error': 'Lesson not found'
        })



    prompt = f"""

    Generate 5 beginner-friendly MCQ quiz questions.

    Lesson:
    {lesson.title}

    Return ONLY valid JSON.

    Format:

    [
      {{
        "question": "Question",
        "options": [
          "Option 1",
          "Option 2",
          "Option 3",
          "Option 4"
        ],
        "correct_answer": "Correct option",
        "explanation": "Explanation"
      }}
    ]

    Do not return markdown.
    Do not wrap in ```json.
    """



    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )



    import json



    try:

        quizzes = json.loads(response.text)

    except json.JSONDecodeError:

        return Response({
            'error': 'Invalid AI response'
        })



    # Delete old quizzes

    lesson.quizzes.all().delete()



    # Save quizzes

    for quiz in quizzes:

        Quiz.objects.create(

            lesson=lesson,

            question=quiz['question'],

            option1=quiz['options'][0],

            option2=quiz['options'][1],

            option3=quiz['options'][2],

            option4=quiz['options'][3],

            correct_answer=quiz['correct_answer'],

            explanation=quiz['explanation']
        )



    return Response({
        'message': 'Quiz generated successfully'
    })