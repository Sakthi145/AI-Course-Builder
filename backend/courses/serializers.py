from rest_framework import serializers
from .models import Course, Module, Lesson, Quiz, Note, QuizAttempt


class NoteSerializer(serializers.ModelSerializer):

    class Meta:

        model = Note

        fields = '__all__'

        read_only_fields = ['lesson']



class QuizAttemptSerializer(serializers.ModelSerializer):

    class Meta:

        model = QuizAttempt

        fields = '__all__'

        read_only_fields = [
            'user',
            'lesson',
            'score'
        ]


class QuizSerializer(serializers.ModelSerializer):

    class Meta:

        model = Quiz

        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):

    quizzes = QuizSerializer(
        many=True,
        read_only=True
    )

    
    class Meta:

        model = Lesson

        fields = '__all__'


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['user']


class LessonDetailSerializer(serializers.ModelSerializer):

    module_title = serializers.CharField(
        source='module.title',
        read_only=True
    )

    quizzes = QuizSerializer(
        many=True,
        read_only=True
    )

    

    class Meta:

        model = Lesson

        fields = '__all__'





