import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lumora_project.settings')
django.setup()

from lumora.models import Course, Topic, Level, Games, Tiles

src = Course.objects.filter(courseid='course_nak924050').first()
if not src:
    print("Source course course_nak924050 not found!")
    exit(1)

# Delete existing course_nak216668 objects
Course.objects.filter(courseid='course_nak216668').delete()
old_topics = Topic.objects.filter(courseid='course_nak216668')
for ot in old_topics:
    old_lvls = Level.objects.filter(topic_id=ot.topic_id)
    for ol in old_lvls:
        old_gms = Games.objects.filter(level_id=ol.level_id)
        for og in old_gms:
            Tiles.objects.filter(gameid=og.gameid).delete()
        old_gms.delete()
    old_lvls.delete()
old_topics.delete()

# Recreate course_nak216668
Course.objects.create(
    courseid='course_nak216668',
    name=src.name,
    order=src.order,
    course_tip=src.course_tip,
    live='yes',
    email=src.email
)

top_src = Topic.objects.filter(courseid='course_nak924050').order_by('order')
for m_idx, t in enumerate(top_src, 1):
    new_t_id = f'top_nak216668_{m_idx}'
    Topic.objects.create(
        topic_id=new_t_id,
        courseid='course_nak216668',
        name=t.name,
        order=t.order,
        topic_tip=t.topic_tip,
        live='yes'
    )
    
    lvls = Level.objects.filter(topic_id=t.topic_id).order_by('order')
    for l_idx, l in enumerate(lvls, 1):
        new_l_id = f'lvl_nak216668_{m_idx}_{l_idx}'
        Level.objects.create(
            level_id=new_l_id,
            topic_id=new_t_id,
            name=l.name,
            order=l.order,
            level_tip=l.level_tip,
            live='yes'
        )
        
        gms = Games.objects.filter(level_id=l.level_id).order_by('order')
        for g_idx, g in enumerate(gms, 1):
            new_g_id = f'gme_nak216668_{m_idx}_{l_idx}_{g_idx}'
            Games.objects.create(
                gameid=new_g_id,
                level_id=new_l_id,
                name=g.name,
                order=g.order,
                gameTip=g.gameTip,
                passage_text=g.passage_text,
                grade_band=g.grade_band,
                difficulty=g.difficulty,
                target_skill=g.target_skill,
                live='yes'
            )
            
            tls = Tiles.objects.filter(gameid=g.gameid).order_by('qno')
            for q_idx, q in enumerate(tls, 1):
                Tiles.objects.create(
                    gameid=new_g_id,
                    tileid=f'{new_g_id}_q{q_idx}',
                    qno=q.qno,
                    type=q.type,
                    question=q.question,
                    op1=q.op1,
                    op2=q.op2,
                    op3=q.op3,
                    op4=q.op4,
                    correct=q.correct,
                    reason=q.reason,
                    skill_tag=q.skill_tag,
                    has_reasoning_prompt=q.has_reasoning_prompt,
                    live='yes'
                )

print("Successfully mirrored course_nak924050 to course_nak216668!")
