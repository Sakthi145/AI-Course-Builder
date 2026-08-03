from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from rest_framework import status, generics



from .models import Course, Lesson, Note, QuizAttempt

from .serializers import (
    CourseSerializer,
    LessonDetailSerializer,
    NoteSerializer,
    QuizAttemptSerializer
)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def courses_list_create(request):

    # GET all courses

    if request.method == 'GET':

        courses = Course.objects.filter(
            user=request.user
        )

        serializer = CourseSerializer(
            courses,
            many=True
        )

        return Response(serializer.data)



    # CREATE course

    elif request.method == 'POST':

        serializer = CourseSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )





@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_detail(request, pk):

    try:

        course = Course.objects.get(
            pk=pk,
            user=request.user
        )

    except Course.DoesNotExist:

        return Response(
            {'error': 'Course not found'},
            status=status.HTTP_404_NOT_FOUND
        )



    # GET single course

    if request.method == 'GET':

        serializer = CourseSerializer(course)

        return Response(serializer.data)



    # UPDATE course

    elif request.method == 'PUT':

        serializer = CourseSerializer(
            course,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(user=request.user)

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )



    # DELETE course

    elif request.method == 'DELETE':

        course.delete()

        return Response(
            {'message': 'Course deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notes_content(request, lesson_id):

    try:

        lesson = Lesson.objects.get(
            pk=lesson_id,
            module__course__user=request.user
        )

    except Lesson.DoesNotExist:

        return Response(
            {'error': 'Lesson not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':

        notes = Note.objects.filter(
            lesson=lesson
        )

        serializer = NoteSerializer(
            notes,
            many=True
        )

        return Response(serializer.data)
    
    elif request.method == 'POST':

        serializer = NoteSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(lesson=lesson)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def note_detail(request, note_id):

    try:

        note = Note.objects.get(
            pk=note_id,
            lesson__module__course__user=request.user
        )

    except Note.DoesNotExist:

        return Response(
            {'error': 'Note not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'PUT':
        serializer = NoteSerializer(
            note,
            data={'content': request.data.get('content', note.content)},
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    elif request.method == 'DELETE':

        note.delete()

        return Response(
            {'message': 'Note deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )    
    



@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def quiz_attempt(request, lesson_id):

    try:

        lesson = Lesson.objects.get(
            pk=lesson_id,
            module__course__user=request.user
        )

    except Lesson.DoesNotExist:

        return Response(
            {'error': 'Lesson not found'},
            status=status.HTTP_404_NOT_FOUND
        )



    # GET previous attempt

    if request.method == 'GET':

        attempt = QuizAttempt.objects.filter(
            user=request.user,
            lesson=lesson
        ).first()

        if not attempt:

            return Response(
                {},
                status=status.HTTP_200_OK
            )

        serializer = QuizAttemptSerializer(attempt)

        return Response(serializer.data)



    # CREATE or UPDATE attempt

    elif request.method == 'POST':

        selected_answers = request.data.get(
            'selected_answers',
            {}
        )

        score = 0

        for quiz in lesson.quizzes.all():

            selected_answer = selected_answers.get(
                str(quiz.id)
            )

            if selected_answer == quiz.correct_answer:

                score += 1



        attempt, created = QuizAttempt.objects.update_or_create(

            user=request.user,

            lesson=lesson,

            defaults={
                'selected_answers': selected_answers,
                'score': score
            }
        )



        serializer = QuizAttemptSerializer(attempt)

        return Response(serializer.data)



    # DELETE attempt (Retake)

    elif request.method == 'DELETE':

        QuizAttempt.objects.filter(
            user=request.user,
            lesson=lesson
        ).delete()

        return Response(
            {'message': 'Quiz attempt deleted'},
            status=status.HTTP_204_NO_CONTENT
        )




class LessonDetailView(generics.RetrieveAPIView):

    serializer_class = LessonDetailSerializer

    permission_classes = [IsAuthenticated]



    def get_queryset(self):

        return Lesson.objects.filter(
            module__course__user=self.request.user
        )