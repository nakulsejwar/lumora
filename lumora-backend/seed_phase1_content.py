"""
Phase 1 content seed — Lumora reading-comprehension foundation.

Run with:
    PYTHONPATH=/tmp/pylibs DJANGO_SETTINGS_MODULE=lumora_project.settings python3 seed_phase1_content.py

Seeds one real Course -> Topic -> Level -> Game -> Tiles chain per grade band
(3, 5, 7). Grade 3's "The Lost Kite" is the deterministic demo lesson --
its exact 3-question miss sequence (cause-effect -> inference -> evidence)
is load-bearing for the demo script and is left completely unchanged here.
Grades 5 and 7 are additional original content extending the same pattern,
not part of any scripted demo.

Six skill tags used project-wide: main-idea, vocabulary, inference,
cause-effect, sequence, evidence.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lumora_project.settings")
django.setup()

from lumora.models import Course, Topic, Level, Games, Tiles, Categories

PASSAGE_LOST_KITE = (
    "Maya spent all Saturday morning building a kite with her grandfather. "
    "It had a long blue tail and a paper dragon painted on the front. When "
    "the wind picked up in the afternoon, Maya ran to Riverside Park to fly "
    "it. The kite soared higher than the tallest tree, dipping and spinning "
    "against the clouds. Maya laughed and let out more string until only a "
    "tiny speck of blue was visible in the sky. Suddenly, a strong gust "
    "snapped the string. The kite spun away and disappeared over the trees "
    "near the old oak. Maya's stomach dropped. She packed up her things and "
    "walked home, feeling sad about her lost kite. That evening, while "
    "eating dinner, Maya kept thinking about her grandfather's face when he "
    "handed her the kite that morning \u2014 he had spent three weekends "
    "helping her build it. She put down her fork, grabbed a flashlight, and "
    "headed straight back to the park to search under the old oak tree "
    "before it got too dark to see."
)

PASSAGE_SCIENCE_FAIR = (
    "Every year, Deja partnered with her best friend Priya for the school "
    "science fair. This year, when the sign-up sheet went up on the hallway "
    "bulletin board, Deja wrote both their names next to the volcano "
    "project, just like always. But when she checked the list the next "
    "morning, Priya's name had been crossed out and rewritten next to a "
    "different project \u2014 a robotics build with two students from the "
    "advanced math class. The sign-up sheet had a small rule printed at the "
    "bottom: robotics teams needed at least three members, and volcano "
    "projects were capped at two. Deja didn't say anything to Priya at "
    "lunch. She quietly built the volcano alone that week, adding an extra "
    "label about lava viscosity to make it look more impressive on its "
    "own. Two weeks later, at the fair, Priya's robotics team won third "
    "place. When Priya ran over holding the ribbon, Deja noticed her hands "
    "were trembling, and her voice cracked as she described how nervous "
    "she had been presenting to two teammates she barely knew."
)

PASSAGE_LAST_PRACTICE = (
    "Marcus had run varsity distance since freshman year, but by October "
    "of his junior season, he started arriving at practice eleven minutes "
    "late \u2014 always exactly eleven, always with some new excuse about "
    "buses or homework. Coach Alvarez never called him out in front of the "
    "team. Instead, she started opening practice with technique drills "
    "that didn't matter much if you missed the first ten minutes, and "
    "quietly moved his locker assignment to the one nearest the equipment "
    "room door, the one you could reach fastest from the parking lot. She "
    "also stopped putting his name on the whiteboard next to the week's "
    "mile-time goals, though she still wrote his splits down in her "
    "meticulous binder after every single run. When the team's top "
    "runner, Priya, asked why Marcus never seemed to get in trouble like "
    "everyone else did for being late, Coach Alvarez said only that some "
    "runners needed a different kind of push than others, and went back "
    "to setting out cones for the next drill."
)


def blank_ops():
    return {f"op{i}": "" for i in range(5, 9)} | {f"op{i}Link": "" for i in range(5, 9)}


def seed_lesson(course_kwargs, topic_kwargs, level_kwargs, game_kwargs, tiles):
    course, _ = Course.objects.update_or_create(
        courseid=course_kwargs.pop("courseid"), defaults=course_kwargs,
    )
    topic, _ = Topic.objects.update_or_create(
        topic_id=topic_kwargs.pop("topic_id"), defaults=topic_kwargs,
    )
    level, _ = Level.objects.update_or_create(
        level_id=level_kwargs.pop("level_id"), defaults=level_kwargs,
    )
    game, _ = Games.objects.update_or_create(
        gameid=game_kwargs.pop("gameid"), defaults=game_kwargs,
    )
    for t in tiles:
        t = {**t, **blank_ops()}
        Tiles.objects.update_or_create(tileid=t.pop("tileid"), defaults=t)
    return course, topic, level, game, len(tiles)


def run():
    results = []

    # --- Grade 3: "The Lost Kite" -- the deterministic demo lesson, unchanged ---
    results.append(seed_lesson(
        dict(courseid="reading-g3", order=1, name="Reading Comprehension \u2014 Grade 3",
             ImageLink="", course_tip="Short stories with comprehension, inference, and evidence questions.",
             live="Yes", email=""),
        dict(topic_id="g3-inference-practice", courseid="reading-g3", order=1, ImageLink="",
             name="Inference Practice", live="Yes", topic_tip=""),
        dict(level_id="g3-inference-l1", topic_id="g3-inference-practice", order=1, ImageLink="",
             name="Level 1", live="Yes", level_tip=""),
        dict(gameid="the-lost-kite", level_id="g3-inference-l1", order=1, ImageLink="",
             name="The Lost Kite", live="Yes", gameTip="", in_gameTip="", type="MCQ",
             title="The Lost Kite", description="A short story about Maya and her kite.",
             questionTip="Read the story, then answer the questions.",
             passage_text=PASSAGE_LOST_KITE, grade_band="3", difficulty="explicit", target_skill=None),
        [
            dict(tileid="lost-kite-q1", gameid="the-lost-kite", qno=1, type="MCQ",
                 question="Why did Maya go back to the park in the evening?",
                 questionTip="", correct="1",
                 op1="To search for her lost kite before dark", op1Link="",
                 op2="To fly a new kite with her grandfather", op2Link="",
                 op3="To meet her friends for a game", op3Link="",
                 op4="To watch the sunset over the river", op4Link="",
                 reason="The story directly says Maya \u2018headed straight back to the park to search... before it got too dark to see.\u2019",
                 live="Yes", skill_tag="cause-effect"),
            dict(tileid="lost-kite-q2", gameid="the-lost-kite", qno=2, type="MCQ",
                 question="What can you infer about how Maya felt about the kite, based on her actions at dinner?",
                 questionTip="", correct="3",
                 op1="She had already forgotten about the kite", op1Link="",
                 op2="She felt it wasn't important enough to look for", op2Link="",
                 op3="She cared deeply about the kite because of who helped make it", op3Link="",
                 op4="She was planning to build a new kite instead", op4Link="",
                 reason="The story never says Maya \u2018cared deeply\u2019 \u2014 you have to connect her thinking about her grandfather with her decision to go back out.",
                 live="Yes", skill_tag="inference", has_reasoning_prompt=True),
            dict(tileid="lost-kite-q3", gameid="the-lost-kite", qno=3, type="MCQ",
                 question="Which sentence from the story best supports your answer to the last question?",
                 questionTip="", correct="2",
                 op1="The kite soared higher than the tallest tree.", op1Link="",
                 op2="He had spent three weekends helping her build it.", op2Link="",
                 op3="Maya ran to Riverside Park to fly it.", op3Link="",
                 op4="A strong gust snapped the string.", op4Link="",
                 reason="This is the specific detail that explains why the kite mattered so much to Maya.",
                 live="Yes", skill_tag="evidence"),
        ],
    ))

    # --- Grade 5: "The Science Fair Switch" ---
    results.append(seed_lesson(
        dict(courseid="reading-g5", order=1, name="Reading Comprehension \u2014 Grade 5",
             ImageLink="", course_tip="Stories with more layered cause-and-effect and inference.",
             live="Yes", email=""),
        dict(topic_id="g5-reading-practice", courseid="reading-g5", order=1, ImageLink="",
             name="Reading Practice", live="Yes", topic_tip=""),
        dict(level_id="g5-reading-l1", topic_id="g5-reading-practice", order=1, ImageLink="",
             name="Level 1", live="Yes", level_tip=""),
        dict(gameid="the-science-fair-switch", level_id="g5-reading-l1", order=1, ImageLink="",
             name="The Science Fair Switch", live="Yes", gameTip="", in_gameTip="", type="MCQ",
             title="The Science Fair Switch", description="A short story about two science fair partners.",
             questionTip="Read the story, then answer the questions.",
             passage_text=PASSAGE_SCIENCE_FAIR, grade_band="5", difficulty="simple_inference", target_skill=None),
        [
            dict(tileid="sci-fair-q1", gameid="the-science-fair-switch", qno=1, type="MCQ",
                 question="What is this story mostly about?", questionTip="", correct="2",
                 op1="Two friends drifting apart forever", op1Link="",
                 op2="A misunderstanding between friends after a project change", op2Link="",
                 op3="A robotics competition", op3Link="",
                 op4="A rule about volcano projects", op4Link="",
                 reason="The story centers on Deja's reaction to Priya's project change, not the projects themselves.",
                 live="Yes", skill_tag="main-idea"),
            dict(tileid="sci-fair-q2", gameid="the-science-fair-switch", qno=2, type="MCQ",
                 question="Why was Priya's name moved to the robotics project?",
                 questionTip="", correct="2",
                 op1="She asked to switch because she didn't like volcanoes", op1Link="",
                 op2="Robotics teams needed at least three members, per the sign-up rule", op2Link="",
                 op3="Deja removed her from the volcano team", op3Link="",
                 op4="The teacher assigned her randomly", op4Link="",
                 reason="The sign-up sheet's printed rule explains the move directly.",
                 live="Yes", skill_tag="cause-effect"),
            dict(tileid="sci-fair-q3", gameid="the-science-fair-switch", qno=3, type="MCQ",
                 question="What can you infer about how Deja felt about the switch, based on her actions that week?",
                 questionTip="", correct="2",
                 op1="She felt relieved to work alone", op1Link="",
                 op2="She felt hurt but didn't show it", op2Link="",
                 op3="She was excited to try something new", op3Link="",
                 op4="She didn't notice the change at all", op4Link="",
                 reason="Her silence at lunch and quietly working alone suggest hurt she didn't voice.",
                 live="Yes", skill_tag="inference", has_reasoning_prompt=True),
            dict(tileid="sci-fair-q4", gameid="the-science-fair-switch", qno=4, type="MCQ",
                 question="Which detail best supports the idea that Priya was nervous about her new project?",
                 questionTip="", correct="2",
                 op1="She wrote both their names on the volcano project", op1Link="",
                 op2="Her hands were trembling and her voice cracked", op2Link="",
                 op3="Her team won third place", op3Link="",
                 op4="She joined the advanced math class", op4Link="",
                 reason="This is the specific physical detail describing her nervousness.",
                 live="Yes", skill_tag="evidence"),
            dict(tileid="sci-fair-q5", gameid="the-science-fair-switch", qno=5, type="MCQ",
                 question="What did Deja do right after she saw Priya's name had been moved?",
                 questionTip="", correct="3",
                 op1="She immediately confronted Priya", op1Link="",
                 op2="She told the teacher", op2Link="",
                 op3="She quietly signed up to build the volcano alone", op3Link="",
                 op4="She quit the science fair", op4Link="",
                 reason="The story states this as the next thing Deja did.",
                 live="Yes", skill_tag="sequence"),
        ],
    ))

    # --- Grade 7: "The Last Practice" ---
    results.append(seed_lesson(
        dict(courseid="reading-g7", order=1, name="Reading Comprehension \u2014 Grade 7",
             ImageLink="", course_tip="More subtle, literary short stories with layered inference.",
             live="Yes", email=""),
        dict(topic_id="g7-reading-practice", courseid="reading-g7", order=1, ImageLink="",
             name="Reading Practice", live="Yes", topic_tip=""),
        dict(level_id="g7-reading-l1", topic_id="g7-reading-practice", order=1, ImageLink="",
             name="Level 1", live="Yes", level_tip=""),
        dict(gameid="the-last-practice", level_id="g7-reading-l1", order=1, ImageLink="",
             name="The Last Practice", live="Yes", gameTip="", in_gameTip="", type="MCQ",
             title="The Last Practice", description="A short story about a coach and a struggling runner.",
             questionTip="Read the story, then answer the questions.",
             passage_text=PASSAGE_LAST_PRACTICE, grade_band="7", difficulty="evidence_inference", target_skill=None),
        [
            dict(tileid="last-practice-q1", gameid="the-last-practice", qno=1, type="MCQ",
                 question="What is this passage mostly about?", questionTip="", correct="2",
                 op1="A coach disciplining a student athlete publicly", op1Link="",
                 op2="A coach quietly accommodating a struggling runner instead of punishing him", op2Link="",
                 op3="A rivalry between two teammates", op3Link="",
                 op4="A team losing an important race", op4Link="",
                 reason="Every detail in the passage shows quiet accommodation, not punishment or rivalry.",
                 live="Yes", skill_tag="main-idea"),
            dict(tileid="last-practice-q2", gameid="the-last-practice", qno=2, type="MCQ",
                 question="What can you infer about why Coach Alvarez changed the schedule and locker assignment?",
                 questionTip="", correct="2",
                 op1="She forgot about Marcus and made mistakes by accident", op1Link="",
                 op2="She was trying to make it easier for Marcus to stay on the team despite his lateness", op2Link="",
                 op3="She wanted to punish Marcus without saying so", op3Link="",
                 op4="The equipment room needed the space", op4Link="",
                 reason="None of this is stated directly \u2014 it has to be pieced together from her actions.",
                 live="Yes", skill_tag="inference", has_reasoning_prompt=True),
            dict(tileid="last-practice-q3", gameid="the-last-practice", qno=3, type="MCQ",
                 question="Which detail best supports the idea that Coach Alvarez still cared about Marcus's performance?",
                 questionTip="", correct="2",
                 op1="She moved his locker near the door", op1Link="",
                 op2="She kept writing his splits down in her binder after every run", op2Link="",
                 op3="She started practice with technique drills", op3Link="",
                 op4="She talked to Priya about pushing runners differently", op4Link="",
                 reason="Tracking his splits privately shows she was still invested in his progress.",
                 live="Yes", skill_tag="evidence"),
            dict(tileid="last-practice-q4", gameid="the-last-practice", qno=4, type="MCQ",
                 question="In this passage, what does the word \u201cmeticulous\u201d suggest about Coach Alvarez's binder?",
                 questionTip="", correct="2",
                 op1="It was messy and disorganized", op1Link="",
                 op2="It was kept with careful, detailed attention", op2Link="",
                 op3="It was brand new and unused", op3Link="",
                 op4="It belonged to someone else", op4Link="",
                 reason="\u201cMeticulous\u201d describes careful, precise attention to detail.",
                 live="Yes", skill_tag="vocabulary"),
            dict(tileid="last-practice-q5", gameid="the-last-practice", qno=5, type="MCQ",
                 question="Why did Coach Alvarez start opening practice with technique drills?",
                 questionTip="", correct="2",
                 op1="The team requested more technique work", op1Link="",
                 op2="They didn't matter much if a runner missed the first ten minutes", op2Link="",
                 op3="The team needed to prepare for a big meet", op3Link="",
                 op4="Technique drills were required by the school", op4Link="",
                 reason="The passage states this reason directly.",
                 live="Yes", skill_tag="cause-effect"),
        ],
    ))

    total_tiles = sum(r[4] for r in results)
    print(f"Seeded {len(results)} course(s) across grades 3/5/7: "
          f"{Course.objects.count()} course(s), {Topic.objects.count()} topic(s), "
          f"{Level.objects.count()} level(s), {Games.objects.count()} game(s), "
          f"{total_tiles} tiles total")

if __name__ == "__main__":
    run()

