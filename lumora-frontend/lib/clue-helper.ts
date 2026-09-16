import { Question } from "@/types/game.types";

/**
 * Determines whether a question is appropriate for deeper reasoning.
 * Matches: inference, evidence, cause-effect (or cause_effect), or has_reasoning_prompt: true.
 */
export function isReasoningQuestion(question?: Question): boolean {
  if (!question) return false;
  if (question.has_reasoning_prompt) return true;

  const skill = (question.skill_tag || "").toLowerCase().replace(/_/g, "-");
  return ["inference", "evidence", "cause-effect"].includes(skill);
}

/**
 * Extracts a concise subject phrase from question text to contextualize hints.
 */
function extractQuestionSubject(qText: string): string {
  if (!qText) return "";
  let clean = qText
    .replace(
      /^(what|why|how|which|where|when|who)\s+(is|are|was|were|did|does|do|can|could|should|would|is the|are the|was the|were the)\s+/i,
      ""
    )
    .replace(/\?$/, "")
    .trim();

  clean = clean.replace(
    /^(statement|sentence|line|option|choice|detail)\s+(best|most|proves|shows|indicates|supports)\s+/i,
    ""
  );

  const words = clean.split(/\s+/);
  if (words.length > 5) {
    clean = words.slice(0, 5).join(" ");
  }

  clean = clean.replace(/^[^\w"']+|[^\w"']+$/g, "").trim();
  if (clean.length < 3) return "";
  return `"${clean}"`;
}

/**
 * Generates a question-specific hint for the given question and skill.
 */
export function getQuestionClue(
  question?: Question,
  questionIndex?: number
): string {
  if (!question) {
    return "Look closely at the details in the story passage to help solve this reading challenge.";
  }

  // 1. If questionTip exists and is specific (>10 chars), use it
  if (question.questionTip && question.questionTip.trim().length > 10) {
    const tip = question.questionTip.trim();
    if (!/the correct answer is/i.test(tip)) {
      return tip;
    }
  }

  // 2. If reason field exists and is long enough (>15 chars) without revealing answer, adapt it
  if (question.reason && question.reason.trim().length > 15) {
    const reason = question.reason.trim();
    if (!/the correct answer is/i.test(reason)) {
      return reason;
    }
  }

  // 3. Otherwise, construct a question-contextualized hint based on skill and subject
  const skill = (question.skill_tag || "").toLowerCase().replace(/_/g, "-");
  const rawQuestion = question.question || "";
  const subject = extractQuestionSubject(rawQuestion);

  switch (skill) {
    case "inference":
      return subject
        ? `The answer isn't stated directly. Look at what ${subject} suggests in the passage and connect those details.`
        : "The answer isn't stated directly. Look at what the characters do and connect those details.";

    case "evidence":
      return subject
        ? `Search the passage for the specific line describing ${subject}. Which option is directly supported by that line?`
        : "Which sentence or key detail in the passage most strongly supports your answer choice?";

    case "cause-effect":
    case "cause_effect":
      return subject
        ? `Find what happened regarding ${subject}, then ask what event or action caused it to happen.`
        : "Find what happened first, then ask what event or action caused it.";

    case "vocabulary":
      return subject
        ? `Read the sentence around ${subject} in the passage. What do surrounding context clues suggest about its meaning?`
        : "Read the sentence around the word. What does the character's action suggest about its meaning?";

    case "main-idea":
    case "main_idea":
      return subject
        ? `Think about how ${subject} connects to the central message. Look for the idea that ties the passage together.`
        : "Look for the idea that connects the largest part of the passage.";

    case "sequence":
      return subject
        ? `Pay attention to time words and notice the step-by-step order of events involving ${subject}.`
        : "Look for the order in which the important events happened.";

    default:
      return subject
        ? `Re-read the passage details concerning ${subject}. Look for key facts that point to your answer.`
        : "Re-read the passage carefully to spot key evidence that points to the correct conclusion.";
  }
}
