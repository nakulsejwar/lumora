export const LOCKED_SKILL_TAGS = [
  "main-idea",
  "vocabulary",
  "inference",
  "cause-effect",
  "sequence",
  "evidence",
] as const;

export type SkillTag = (typeof LOCKED_SKILL_TAGS)[number];

export const SKILL_INFO: Record<SkillTag, { label: string; description: string }> = {
  "main-idea": {
    label: "Main Idea",
    description: "finding what a story is mostly about",
  },
  vocabulary: {
    label: "Vocabulary",
    description: "understanding tricky words from how they're used",
  },
  inference: {
    label: "Inference",
    description:
      "figuring out what a story suggests even when it doesn't say it directly",
  },
  "cause-effect": {
    label: "Cause & Effect",
    description: "understanding why things happen in a story",
  },
  sequence: {
    label: "Sequence",
    description: "keeping track of the order events happen in",
  },
  evidence: {
    label: "Evidence",
    description: "finding the exact details that support an answer",
  },
};

export type SkillMasteryRow = {
  skill_tag: SkillTag;
  attempts: number;
  correct: number;
  accuracy: number;
};

/**
 * Mirrors the backend's get_weakest_skill() tie-break rule EXACTLY (lowest
 * accuracy among attempted skills, ties broken by LOCKED_SKILL_TAGS order)
 * so the UI's "focus skill" preview always agrees with what the adaptive
 * endpoint will actually generate. This is display-only -- it never
 * chooses what gets sent to the backend; generation always re-derives its
 * own weakest_skill server-side from live UserSkillMastery data.
 */
export function pickFocusSkill(
  mastery: SkillMasteryRow[]
): SkillTag | null {
  const attempted = mastery.filter((r) => r.attempts > 0);
  if (attempted.length === 0) return null;

  const sorted = [...attempted].sort((a, b) => {
    const accDiff = a.correct / a.attempts - b.correct / b.attempts;
    if (accDiff !== 0) return accDiff;
    return (
      LOCKED_SKILL_TAGS.indexOf(a.skill_tag) -
      LOCKED_SKILL_TAGS.indexOf(b.skill_tag)
    );
  });
  return sorted[0].skill_tag;
}
