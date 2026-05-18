
# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='courses'
    )

    title = models.CharField(max_length=255)

    description = models.TextField()

    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES
    )

    duration = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    





class Module(models.Model):

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='modules'
    )

    title = models.CharField(max_length=255)

    order = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.title



class Lesson(models.Model):

    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='lessons'
    )

    title = models.CharField(max_length=255)

    content = models.TextField(blank=True)

    order = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.title
    

class Quiz(models.Model):

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='quizzes'
    )

    question = models.TextField()

    option1 = models.CharField(max_length=255)

    option2 = models.CharField(max_length=255)

    option3 = models.CharField(max_length=255)

    option4 = models.CharField(max_length=255)

    correct_answer = models.CharField(max_length=255)

    explanation = models.TextField(blank=True)

    def __str__(self):

        return self.question
    


class Note(models.Model):

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='notes'
    )

    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notes for {self.lesson.title}" 






class QuizAttempt(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )

    selected_answers = models.JSONField(default=dict)

    score = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):

        return f"{self.user.username} - {self.lesson.title}"