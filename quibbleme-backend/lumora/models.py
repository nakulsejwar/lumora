from django.db import models
import datetime

from django.utils import timezone
# Create your models here.

class CustomerModel(models.Model):
    user = models.CharField(max_length=100)
    stripe_customer_id = models.CharField(max_length=100)
    # default_payment_id = EncryptedCharField(max_length=100,blank=True,null=True,default="null")
    notification_token = models.CharField(max_length=150,null=True, blank=True)


class LumoraScores(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    LumoraUserId = models.CharField(max_length=50,null=True, blank=True)
    gameid = models.CharField(max_length=50,null=True, blank=True)
    score_id = models.CharField(max_length=50,null=True, blank=True)
    score = models.IntegerField(blank=True, null=True)
    course_id = models.CharField(max_length=50,null=True, blank=True)
    course_name = models.CharField(max_length=200,null=True, blank=True)
    totalQuestions = models.IntegerField(blank=True, null=True)
    isComplete = models.BooleanField(default=True)



class LumoraAdmins(models.Model):
    created_at = models.DateTimeField(default=timezone.now,blank=True, null=True)
    uid = models.CharField(max_length=500,blank=True, null=True)
    email = models.CharField(max_length=500,blank=True, null=True)

class LumoraLogs(models.Model):
    Event_Type = models.CharField(max_length=500,blank=True, null=True)
    Event_Name = models.CharField(max_length=500,blank=True, null=True)
    Timestamp = models.DateTimeField(default=timezone.now,blank=True, null=True)
    session_id = models.CharField(max_length=500,blank=True, null=True)
    user_id= models.CharField(max_length=500,blank=True, null=True)
    game_id = models.CharField(max_length=500,blank=True, null=True)
    game_type = models.CharField(max_length=500,blank=True, null=True)
    game_name = models.CharField(max_length=500,blank=True, null=True)
    answer = models.BooleanField(blank=True, null=True)
    userinput = models.BooleanField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    next_game_id = models.CharField(max_length=500,blank=True, null=True)
    next_game_name = models.CharField(max_length=500,blank=True, null=True)
    # Phase 2 (adaptive measurement): every answer event now also records which
    # reading skill it exercised and whether it was correct, so UserSkillMastery
    # can be rolled up straight from this log without a second write path.
    skill_tag = models.CharField(max_length=100,null=True, blank=True)
    is_correct = models.BooleanField(blank=True, null=True)
    


class Games(models.Model):
    name = models.CharField(max_length=150)
    created_at = models.DateTimeField(default=timezone.now)
    order = models.IntegerField(blank=True, null=True)
    ImageLink = models.CharField(max_length=1500,null=True, blank=True)
    gameid= models.CharField(max_length=200, null=True, blank=True)
    level_id= models.CharField(max_length=200, null=True, blank=True)
    gameTip =models.TextField( null=True, blank=True)
    in_gameTip =models.TextField( null=True, blank=True)
    live = models.CharField(max_length=1500,null=True, blank=True)
    level = models.IntegerField(blank=True, null=True)
    topic = models.CharField(max_length=1500,null=True, blank=True)
    journey_topic  = models.CharField(max_length=1500,null=True, blank=True)
    journey = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=100,null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    questionTip = models.TextField(null=True, blank=True)
    # Phase 1 (reading-coach content foundation): a "Game" is one reading lesson
    # -- one passage plus its question tiles. passage_text is the actual story
    # the learner reads; grade_band/difficulty describe it; target_skill is only
    # set when this lesson was generated adaptively to drill a specific weak
    # skill (Phase 3), so the frontend/demo can label it ("Inference-focused
    # lesson") instead of guessing from the question mix.
    passage_text = models.TextField(null=True, blank=True)
    grade_band = models.CharField(max_length=20, null=True, blank=True)  # "3" | "5" | "7"
    difficulty = models.CharField(max_length=20, null=True, blank=True)  # "explicit"|"simple_inference"|"evidence_inference"|"multi_step"
    target_skill = models.CharField(max_length=100, null=True, blank=True)


class Tiles(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    gameid= models.CharField(max_length=200, null=True, blank=True)
    tileid= models.CharField(max_length=200, null=True, blank=True)
    type = models.CharField(max_length=100,null=True, blank=True,default='mcq')
    qno = models.IntegerField(blank=True, null=True)
    question =models.TextField( null=True, blank=True)
    questionTip = models.TextField(null=True, blank=True)
    correct = models.CharField(max_length=1500,null=True, blank=True)
    op1 =models.TextField( null=True, blank=True)
    op1Link = models.CharField(max_length=1500,null=True, blank=True)
    op2 =models.TextField( null=True, blank=True)
    op2Link = models.CharField(max_length=1500,null=True, blank=True)
    op3 =models.TextField( null=True, blank=True)
    op3Link = models.CharField(max_length=1500,null=True, blank=True)
    op4 =models.TextField( null=True, blank=True)
    op4Link = models.CharField(max_length=1500,null=True, blank=True)
    op5 =models.TextField( null=True, blank=True)
    op5Link = models.CharField(max_length=1500,null=True, blank=True)
    op6 =models.TextField( null=True, blank=True)
    op6Link = models.CharField(max_length=1500,null=True, blank=True)
    op7 =models.TextField( null=True, blank=True)
    op7Link = models.CharField(max_length=1500,null=True, blank=True)
    op8 =models.TextField( null=True, blank=True)
    op8Link = models.CharField(max_length=1500,null=True, blank=True)
    reason =models.TextField( null=True, blank=True)
    live = models.CharField(max_length=1500,null=True, blank=True)
    # Phase 1: which reading skill this specific question exercises. One of
    # main-idea | vocabulary | inference | cause-effect | sequence | evidence.
    skill_tag = models.CharField(max_length=100, null=True, blank=True)
    # Stretch feature: when true, the frontend shows a typed "Why do you
    # think so?" prompt after this question is answered, graded by an LLM
    # rubric via GradeExplanation. Deliberately kept to 1-2 questions per
    # lesson (usually the inference question) -- not every question.
    has_reasoning_prompt = models.BooleanField(default=False)

class MCQ(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    gameid= models.CharField(max_length=200, null=True, blank=True)
    type = models.CharField(max_length=100,null=True, blank=True,default='mcq')
    name = models.CharField(max_length=200, null=True, blank=True)
    topic = models.CharField(max_length=1500,null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    ImageLink = models.CharField(max_length=1500,null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    gameTip =models.TextField( null=True, blank=True)
    questionTip = models.TextField(null=True, blank=True)
    journey = models.TextField(null=True, blank=True)
    order = models.IntegerField(blank=True, null=True)
    mcqid= models.CharField(max_length=200, null=True, blank=True)
    qno = models.IntegerField(blank=True, null=True)
    question =models.TextField( null=True, blank=True)
    op1 =models.TextField( null=True, blank=True)
    op1Link = models.CharField(max_length=1500,null=True, blank=True)
    op2 =models.TextField( null=True, blank=True)
    op2Link = models.CharField(max_length=1500,null=True, blank=True)
    op3 =models.TextField( null=True, blank=True)
    op3Link = models.CharField(max_length=1500,null=True, blank=True)
    op4 =models.TextField( null=True, blank=True)
    op4Link = models.CharField(max_length=1500,null=True, blank=True)
    correct = models.CharField(max_length=1500,null=True, blank=True)
    level = models.IntegerField(blank=True, null=True)
    skill_tag = models.CharField(max_length=100, null=True, blank=True)

class Mixed(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    gameid= models.CharField(max_length=200, null=True, blank=True)
    type = models.CharField(max_length=100,null=True, blank=True,default='mcq')
    name = models.CharField(max_length=200, null=True, blank=True)
    topic = models.CharField(max_length=1500,null=True, blank=True)
    journey_topic  = models.CharField(max_length=1500,null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    ImageLink = models.CharField(max_length=1500,null=True, blank=True)
    GameImageLink = models.CharField(max_length=1500,null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    gameTip =models.TextField( null=True, blank=True)
    questionTip = models.TextField(null=True, blank=True)
    journey = models.TextField(null=True, blank=True)
    order = models.IntegerField(blank=True, null=True)
    qid= models.CharField(max_length=200, null=True, blank=True)
    qno = models.IntegerField(blank=True, null=True)
    question =models.TextField( null=True, blank=True)
    op1 =models.TextField( null=True, blank=True)
    op1Link = models.CharField(max_length=1500,null=True, blank=True)
    op2 =models.TextField( null=True, blank=True)
    op2Link = models.CharField(max_length=1500,null=True, blank=True)
    op3 =models.TextField( null=True, blank=True)
    op3Link = models.CharField(max_length=1500,null=True, blank=True)
    op4 =models.TextField( null=True, blank=True)
    op4Link = models.CharField(max_length=1500,null=True, blank=True)
    correct = models.CharField(max_length=1500,null=True, blank=True)
    level = models.IntegerField(blank=True, null=True)
    skill_tag = models.CharField(max_length=100, null=True, blank=True)


class Course(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    courseid= models.CharField(max_length=200, null=True, blank=True)
    name = models.TextField(null=True, blank=True)
    order = models.IntegerField(blank=True, null=True)
    course_tip = models.TextField(null=True, blank=True)
    ImageLink = models.CharField(max_length=1500,null=True, blank=True)
    journey = models.TextField(null=True, blank=True)
    topic = models.CharField(max_length=1500,null=True, blank=True)
    level = models.IntegerField(blank=True, null=True)
    gameid= models.CharField(max_length=200, null=True, blank=True)
    category_id = models.CharField(max_length=2000,null=True, blank=True)
    live = models.CharField(max_length=1500,null=True, blank=True)
    email = models.CharField(max_length=500,blank=True, null=True)
    categories = models.ManyToManyField('Categories', related_name='courses')
     

class Topic(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    topic_id= models.CharField(max_length=200, null=True, blank=True)
    courseid= models.CharField(max_length=200, null=True, blank=True)
    ImageLink = models.CharField(max_length=1500,null=True, blank=True)
    name = models.TextField(null=True, blank=True)
    order = models.IntegerField(blank=True, null=True)
    topic_tip = models.TextField(null=True, blank=True)
    live = models.CharField(max_length=1500,null=True, blank=True)
    
class Level(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    level_id= models.CharField(max_length=200, null=True, blank=True)
    topic_id= models.CharField(max_length=200, null=True, blank=True)
    ImageLink = models.CharField(max_length=1500,null=True, blank=True)
    name = models.TextField(null=True, blank=True)
    order = models.IntegerField(blank=True, null=True)
    level_tip = models.TextField(null=True, blank=True)
    live = models.CharField(max_length=1500,null=True, blank=True)

class LumoraUsers(models.Model):
    LumoraUser = models.CharField(max_length=50)
    LumoraUserId = models.CharField(max_length=50,null=True, blank=True)
    LumoraEmail = models.CharField(max_length=50, default="null")
    # ReferralCode = models.CharField(max_length=7)
    image= models.CharField(max_length=500, default="null")
    provider= models.CharField(max_length=500, default="null")
    logo=models.CharField(max_length=200,default="/images/lumora_avatar_1.svg")

class StreakData(models.Model):
    created_at = models.DateField(default=timezone.now)
    streak = models.IntegerField(blank=True, null=True, default=0)
    current_streak = models.IntegerField(blank=True, null=True, default=0)
    game_id = models.CharField(max_length=200,null=True, blank=True)
    LumoraUserId = models.CharField(max_length=50,null=True, blank=True)


class UserSkillMastery(models.Model):
    """
    Phase 2 (measurement). The entire "adaptive learner model" for this
    product, on purpose: a per-user, per-skill accuracy rollup, nothing more.
    Updated after every answered question (see LumoraLogs.skill_tag /
    is_correct); read by the Phase 3 generator to pick the weakest skill.
    """
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    LumoraUserId = models.CharField(max_length=50, null=True, blank=True)
    skill_tag = models.CharField(max_length=100, null=True, blank=True)
    attempts = models.IntegerField(default=0)
    correct = models.IntegerField(default=0)

    class Meta:
        unique_together = ("LumoraUserId", "skill_tag")

    @property
    def accuracy(self):
        if not self.attempts:
            return None
        return round(self.correct / self.attempts, 4)

class AdminHistory(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    uid= models.CharField(max_length=200, null=True, blank=True)
    AdminEmail = models.CharField(max_length=200,null=True, blank=True)
    data = models.JSONField(null=True, blank=True)

class AdminDataQueue(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    AdminEmail = models.CharField(max_length=200,null=True, blank=True)
    topic = models.CharField(max_length=500,null=True, blank=True)
    status = models.CharField(max_length=500,null=True, blank=True)
    completed = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now_add=True, editable=False,blank=True, null=True)



class Categories(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    category_id = models.CharField(max_length=200,null=True, blank=True)
    name = models.CharField(max_length=500,null=True, blank=True)
    ImageLink = models.CharField(max_length=1500,null=True, blank=True)
    # courses = models.CharField(max_length=1000,null=True, blank=True)
    # courses = models.ManyToManyField(Course, related_name='categories')


class Book(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    book_id = models.CharField(max_length=200, null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    userEmail = models.CharField(max_length=200, null=True, blank=True)
    createdBy = models.JSONField(null=True, blank=True)
    quiz = models.JSONField(null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)
    ImgUrl = models.CharField(max_length=500, null=True, blank=True)
    islive = models.BooleanField(default=False)
    tags = models.JSONField(null=True, blank=True)
    category = models.TextField(max_length=500, null=True, blank=True)
    last_updated = models.DateTimeField(auto_now_add=True, editable=True, blank=True, null=True)

    @property
    def blog_id(self):
        return self.book_id

    @blog_id.setter
    def blog_id(self, value):
        self.book_id = value

    class Meta:
        db_table = 'lumora_books'