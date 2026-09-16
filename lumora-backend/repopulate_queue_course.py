import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lumora_project.settings')
django.setup()

from lumora.models import Course, Topic, Level, Games, Tiles, AdminDataQueue
from lumora.api.views import create_courses_task

queue_course_id = "course_nak216668"
topic_name = "Mission: Lost on Mars"
email = "nakul@lumora.ai"

print(f"[REPOPULATE] Clearing old data for {queue_course_id}...")

c = Course.objects.filter(courseid=queue_course_id).first()
if c:
    c.delete()

topics = Topic.objects.filter(courseid=queue_course_id)
for t in topics:
    lvls = Level.objects.filter(topic_id=t.topic_id)
    for l in lvls:
        gms = Games.objects.filter(level_id=l.level_id)
        for g in gms:
            Tiles.objects.filter(gameid=g.gameid).delete()
        gms.delete()
    lvls.delete()
topics.delete()

print("[REPOPULATE] Calling create_courses_task for topic:", topic_name)
create_courses_task(email, [{"topic": topic_name, "modules": 5}])

print("[REPOPULATE] Checking generated database stats...")

courses = Course.objects.filter(name=topic_name)
for course in courses:
    t_count = Topic.objects.filter(courseid=course.courseid).count()
    l_count = Level.objects.filter(topic_id__in=Topic.objects.filter(courseid=course.courseid).values_list('topic_id', flat=True)).count()
    g_count = Games.objects.filter(level_id__in=Level.objects.filter(topic_id__in=Topic.objects.filter(courseid=course.courseid).values_list('topic_id', flat=True)).values_list('level_id', flat=True)).count()
    q_count = Tiles.objects.filter(gameid__in=Games.objects.filter(level_id__in=Level.objects.filter(topic_id__in=Topic.objects.filter(courseid=course.courseid).values_list('topic_id', flat=True)).values_list('level_id', flat=True)).values_list('gameid', flat=True)).count()
    
    print(f"Course ID: {course.courseid} | Title: {course.name}")
    print(f"  Modules: {t_count}")
    print(f"  Levels:  {l_count}")
    print(f"  Games:   {g_count}")
    print(f"  Tiles:   {q_count}")
