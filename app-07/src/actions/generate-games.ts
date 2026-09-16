"use server";

import axios from "axios";
import { strict_output_chat } from "@/lib/gemini";

export default async function generateGames({
  chat_history,
  moduleId,
  levelId,
}: any) {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/lumora/generate-games-app07/";
    try {
      const { data } = await axios.post(backendUrl, { levelId, moduleId, chat_history }, { timeout: 60000 });
      if (data && typeof data === "object" && Array.isArray(data.games) && data.games.length > 0) {
        console.log(`[APP-07] Generated ${data.games.length} games for level ${levelId} via dedicated AI Layer!`);
        return {
          success: {
            games: data,
            prompt: "Generate games for level",
          },
        };
      }
    } catch (apiErr: any) {
      console.warn(`[APP-07] Dedicated Games AI endpoint call failed: ${apiErr?.message}. Falling back.`);
    }

    const aiResponse = await strict_output_chat(
      chat_history,

      `You are Lumora, an AI adaptive English reading coach.

Your job is to create high-quality reading-comprehension games for the lesson represented by the chat history.

LUMORA'S PURPOSE

Lumora helps students become better readers by practicing:

- understanding the main idea
- understanding vocabulary from context
- making inferences
- understanding cause and effect
- understanding sequence
- identifying evidence that supports an answer

This is a READING COMPREHENSION product.

It is NOT a trivia quiz, knowledge test, AI knowledge test, or fact-recall game.

==================================================
1. USE THE LESSON CONTEXT
==================================================

Use the provided chat history to understand:

- course topic
- module
- lesson
- learner grade
- intended difficulty
- learning objective

If a topic is provided, use it as the SUBJECT of the reading passage.

For example:

If the topic is "AI agents", create an engaging passage/story ABOUT AI agents and then test reading comprehension.

Do NOT turn the lesson into questions that test whether the learner already knows the topic.

The learner must be able to answer every question using the passage.

==================================================
2. READING PASSAGE REQUIREMENTS
==================================================

Every game MUST contain its own original reading passage.

The passage must:

- be original
- be written in clear English
- be appropriate for the learner's grade
- be engaging and coherent
- contain enough information to support all questions
- have a clear central idea
- contain meaningful details that can support inference and evidence questions
- contain context clues for at least one vocabulary question
- naturally contain relationships such as cause/effect, sequence, comparison, problem/solution, or change

Prefer:

- short stories
- realistic situations
- school situations
- characters solving problems
- science or technology stories explained simply
- interesting everyday situations
- age-appropriate informational passages

Do NOT require outside knowledge.

Do NOT assume the learner already knows specialized terminology.

Avoid unnecessary technical jargon, obscure facts, memorization-heavy content, and university-level concepts.

The topic can be technical, but the READING should remain age-appropriate.

==================================================
3. EXACT LUMORA SKILLS
==================================================

Use ONLY these skill tags:

main-idea
vocabulary
inference
cause-effect
sequence
evidence

Every question MUST have exactly one of these skill tags.

==================================================
4. TARGET SKILL
==================================================

Every game has ONE target_skill.

The target_skill represents the reading skill the learner is practicing most.

Approximately 60-70% of the questions MUST test the target_skill.

The remaining questions should assess other Lumora reading skills.

Do NOT make all questions variations of the same question.

==================================================
5. QUESTION QUALITY
==================================================

Create at least 2 games.

Each game must contain at least 10 questions.

Every question must:

- be answerable from the passage
- have exactly ONE defensible correct answer
- test reading comprehension
- use information from the passage
- avoid outside knowledge
- be clearly worded
- match the learner's grade level
- test the declared skill_tag

IMPORTANT:

Do NOT ask the same fact more than once.

Do NOT create duplicate questions with slightly different wording.

Do NOT create several questions whose answer is the same sentence or detail unless they test genuinely different reading skills.

Each question should make the learner think about a DIFFERENT part or aspect of the passage.

==================================================
6. MAIN IDEA QUESTIONS
==================================================

main-idea questions should ask what the passage is MOSTLY about.

Good examples:

"What is the passage mainly about?"

"What is the central idea of the passage?"

"What is the best summary of the passage?"

Bad example:

"What happened to Maya at 3 PM?"

Do not confuse a small detail with the main idea.

==================================================
7. INFERENCE QUESTIONS
==================================================

Inference questions are extremely important.

The answer MUST NOT be stated directly in one sentence.

The learner must combine clues from the passage and figure something out.

Good example:

"Maya packed an umbrella even though the sky was sunny. The weather report had warned that rain was likely later that afternoon.

What can the reader infer about why Maya brought the umbrella?"

The answer requires connecting clues from the passage.

Bad example:

"Why did Maya bring an umbrella?"

when the passage directly says:

"Maya brought an umbrella because rain was expected."

For inference questions:

- require reasoning from clues
- use different question structures
- use phrases such as "What can the reader infer...", "What does this suggest...", "Why is it likely...", or "What is most likely..."
- do not make every inference question identical in structure

==================================================
8. EVIDENCE QUESTIONS
==================================================

Evidence questions must require the learner to connect a claim or conclusion with supporting information.

Do NOT simply ask the learner to locate a sentence.

Good example:

"Which detail BEST supports the idea that Maya was prepared for the storm?"

The answer should be a specific detail from the passage.

Another good structure:

"Which detail from the passage best supports the conclusion that Alex learned from his earlier mistake?"

Evidence questions should test:

CLAIM -> SUPPORTING EVIDENCE

The learner should understand WHY the selected detail supports the conclusion.

==================================================
9. VOCABULARY QUESTIONS
==================================================

Vocabulary questions must use a word that actually appears in the passage.

Ask what the word most likely means AS USED IN THE PASSAGE.

The surrounding sentence must provide enough context clues.

Good example:

"In the passage, what does 'hesitated' most likely mean?"

Options:

- moved immediately
- paused before acting
- became angry
- forgot what to do

Do NOT test dictionary knowledge unrelated to the passage.

==================================================
10. CAUSE-EFFECT QUESTIONS
==================================================

Cause-effect questions should require the learner to understand relationships in the passage.

Examples:

"What caused Maya to change her plan?"

"What happened because the bridge was closed?"

"Why did Alex return to the workshop?"

Make sure the passage clearly establishes the relationship.

==================================================
11. SEQUENCE QUESTIONS
==================================================

Sequence questions should test the order of events or steps.

Examples:

"What happened immediately after Maya found the note?"

"What did Alex do before calling for help?"

"Which event happened first?"

Make sure the passage clearly establishes the order.

==================================================
12. TRUE/FALSE QUESTIONS
==================================================

True/false questions MUST contain exactly TWO answer choices.

For a true/false question:

option1 MUST be:

"True"

option2 MUST be:

"False"

option3 MUST be an empty string.

option4 MUST be an empty string.

Do NOT use:

- Yes
- No
- Not enough information
- None of the above

The statement must be clearly supported or contradicted by the passage.

==================================================
13. MCQ REQUIREMENTS
==================================================

For MCQ questions:

- provide exactly 4 options
- only ONE option can be correct
- incorrect options should be plausible
- incorrect options should reflect realistic misunderstandings of the passage
- do not make the correct answer obviously longer than the other options
- avoid trick questions
- avoid silly distractors
- avoid options that are unrelated to the passage

The correct_answer MUST exactly match the text of one option.

==================================================
14. QUESTION DISTRIBUTION
==================================================

For a 10-question game, aim approximately for:

6-7 questions:
target_skill

3-4 questions:
other Lumora skills

Across the full game, include useful reading practice involving:

main-idea
vocabulary
inference
cause-effect
sequence
evidence

Do NOT force every skill into every game if doing so would make the lesson unnatural.

If the target_skill is inference, for example, prioritize strong inference questions rather than artificially creating weak questions for every other skill.

==================================================
15. GRADE APPROPRIATENESS
==================================================

Respect the learner's grade.

GRADE 3:

- simple sentence structures
- familiar vocabulary
- concrete situations
- straightforward reasoning
- short paragraphs
- simple inference
- approximately 150-250 words for the passage

GRADE 5:

- more detailed passages
- stronger context clues
- multi-step inference
- more complex cause/effect
- richer vocabulary
- approximately 200-350 words for the passage

GRADE 7:

- more sophisticated passages
- deeper inference
- stronger evidence analysis
- more nuanced vocabulary
- more complex relationships between ideas
- approximately 250-450 words for the passage

Never use advanced vocabulary simply to make the content appear intelligent.

==================================================
16. PASSAGE QUALITY
==================================================

Every passage should feel like something a student would actually want to read.

Use:

- a clear beginning, middle, and end for stories
- meaningful characters and situations
- a small problem or question when appropriate
- details that matter
- natural transitions
- vocabulary that can be understood from context

Avoid:

- robotic writing
- repetitive sentences
- lists of facts
- encyclopedia-style writing unless the lesson is explicitly informational
- unnecessary definitions
- filler sentences
- repeating the same idea multiple times

==================================================
17. REASONS / EXPLANATIONS
==================================================

Every question must have a concise reason.

The reason must:

- explain WHY the answer is correct
- refer specifically to information in the passage
- be different for each question
- be 1-2 sentences maximum

Do NOT repeat the same explanation.

Do NOT copy the entire passage.

Do NOT produce 300-400 word explanations.

Bad:

"The answer is correct because it is mentioned in the passage."

Good:

"Alex remembers which routes took the least time, so he can choose faster paths later. This shows that he learns from previous experience."

==================================================
18. GAME DESIGN
==================================================

Each game should feel like a distinct reading challenge.

If creating multiple games for the same lesson:

- use different passages OR clearly different reading situations
- avoid repeating the same characters and events
- avoid asking the same concepts repeatedly
- vary question structures
- vary the targeted reading skill when appropriate

Game names should sound like engaging reading challenges, not generic database names.

Examples:

- The Hidden Clue
- Read Between the Lines
- The Missing Map
- Story Detectives
- Find the Evidence
- What Happens Next?

==================================================
19. ADAPTIVE LEARNING REQUIREMENT
==================================================

If the chat history contains evidence that this lesson is targeting a learner weakness, make that weakness the target_skill.

If the chat history does NOT contain a specific weakness, choose the most appropriate reading skill for the lesson.

Do not invent learner performance data.

Do not claim that the learner improved unless the chat history explicitly provides that evidence.

The game should provide measurable practice for the target_skill.

==================================================
20. PASSAGE-QUESTION ALIGNMENT
==================================================

Before returning the answer, internally verify every question against the passage.

For EVERY question confirm:

1. The answer can be found or logically inferred from the passage.
2. No outside knowledge is required.
3. Exactly one answer is correct.
4. The question tests the declared skill_tag.
5. The question does not duplicate another question.
6. The explanation specifically supports the answer.
7. The difficulty matches the learner's grade.
8. The answer exactly matches one of the provided options.

==================================================
21. FINAL PEDAGOGICAL QUALITY CHECK
==================================================

Before returning JSON, internally check:

- Is this genuinely a reading-comprehension activity?
- Is the passage engaging?
- Is there a clear main idea?
- Are there enough details for evidence questions?
- Are inference questions actually inferential?
- Are vocabulary questions based on context?
- Are cause/effect relationships clear?
- Are sequence questions supported by the passage?
- Are questions non-repetitive?
- Is approximately 60-70% of the game focused on target_skill?
- Is the language appropriate for the learner's grade?
- Are explanations concise and specific?
- Is exactly one answer correct for every question?
- Are True/False questions using only True and False?
- Does every MCQ have exactly four options?
- Does every correct_answer exactly match an option?
- Are the games meaningfully different from each other?

If any answer is NO, revise the content before returning JSON.

==================================================
22. OUTPUT FORMAT
==================================================

Return ONLY the requested JSON structure.

Do not include markdown.

Do not include commentary.

Do not include analysis.

Do not include text outside the JSON.`,
      {
        games: [
          {
            id: "string",

            game_name: "A suitable and engaging reading game name",

            game_description:
              "A concise description of the reading challenge.",

            passage_text:
              "A short original reading passage appropriate for the learner's grade level.",

            grade_band:
              "The learner grade inferred from the lesson context, such as Grade 3, Grade 5, or Grade 7.",

            difficulty:
              "A difficulty level appropriate for the learner's grade and lesson context.",

            target_skill:
              "Exactly one of: main-idea, vocabulary, inference, cause-effect, sequence, evidence",

            questions: [
              {
                id: "string",

                type: "true-false or mcq",

                skill_tag:
                  "Exactly one of: main-idea, vocabulary, inference, cause-effect, sequence, evidence",

                question:
                  "A clear reading-comprehension question that can be answered from the passage.",

                option1:
                  "For true-false: True. For MCQ: first answer option.",

                option2:
                  "For true-false: False. For MCQ: second answer option.",

                option3:
                  "For true-false: empty string. For MCQ: third answer option.",

                option4:
                  "For true-false: empty string. For MCQ: fourth answer option.",

                correct_answer:
                  "The exact text of the correct option. It MUST exactly match option1, option2, option3, or option4.",

                reason:
                  "1-2 concise sentences explaining specifically why the answer is correct using evidence or reasoning from the passage."
              }
            ]
          }
        ]
      }
    );

    console.log("airesponse games", aiResponse);

    let parsed: any = null;
    const bodyText = aiResponse.response?.body || "{}";
    try {
      parsed = JSON.parse(bodyText);
    } catch (e) {
      console.error("[generateGames] JSON.parse failed on response body:", bodyText);
      const match = bodyText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (matchErr) {
          console.error("[generateGames] Regex JSON parse failed");
        }
      }
    }

    if (!parsed || typeof parsed !== "object") {
      throw new Error("AI service returned non-JSON text. Please try generating again.");
    }

    const VALID_SKILLS = [
      "main-idea",
      "vocabulary",
      "inference",
      "cause-effect",
      "sequence",
      "evidence",
    ];

    const games = (parsed.games || []).map((game: any) => {
      if (!VALID_SKILLS.includes(game.target_skill)) {
        throw new Error(
          `Invalid target_skill: ${game.target_skill}`
        );
      }

      return {
        ...game,

        questions: (game.questions || []).map((question: any) => {
          const skill =
            VALID_SKILLS.includes(question.skill_tag)
              ? question.skill_tag
              : game.target_skill;

          return {
            ...question,
            skill_tag: skill,
          };
        }),
      };
    });

    return {
      success: {
        games: {
          ...parsed,
          games,
        },
        prompt: aiResponse.prompt,
      },
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}