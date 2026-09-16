"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { gradeExplanation, ExplanationFeedback } from "@/actions/grade-explanation";
import { Sparkles, Brain, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { showValidationToast } from "@/lib/hooks/use-validation-toast";
import { Question } from "@/types/game.types";

type Props = {
  userId?: string;
  gameId: string;
  tileId: string;
  question: Question;
};

export const ReasoningPrompt: React.FC<Props> = ({
  userId,
  gameId,
  tileId,
  question,
}) => {
  const [showExplanationInput, setShowExplanationInput] = React.useState(false);
  const [text, setText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<ExplanationFeedback | null>(null);

  // Reset state whenever tileId changes (moving to the next question)
  React.useEffect(() => {
    setShowExplanationInput(false);
    setText("");
    setIsSubmitting(false);
    setFeedback(null);
  }, [tileId]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      showValidationToast(
        "warning",
        "Add your thinking",
        "Tell Lumora why you chose this answer."
      );
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await gradeExplanation({
        userId: userId || "anonymous",
        gameId,
        tileId,
        explanation: text.trim(),
      });
      setFeedback(result);
    } catch (err) {
      console.error("Failed to grade explanation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 transition-all">
      {!showExplanationInput && !feedback ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#faf8ff] border border-[#0091cf]/30 shadow-sm">
          <div className="flex items-center gap-2.5 text-sm text-[#070235] font-semibold">
            <Brain className="w-5 h-5 text-[#0091cf] shrink-0" />
            <span>Want to show your thinking?</span>
          </div>
          <button
            onClick={() => setShowExplanationInput(true)}
            className="px-4 py-2 rounded-xl bg-[#0091cf]/10 hover:bg-[#0091cf]/20 border border-[#0091cf]/30 text-[#0091cf] text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <span>🧠 Explain Your Answer</span>
          </button>
        </div>
      ) : showExplanationInput && !feedback ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8ff] border-2 border-[#0091cf]/40 shadow-md space-y-3 relative overflow-hidden text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0091cf]/10 border border-[#0091cf]/30 text-[#0091cf] text-xs font-mono font-extrabold uppercase tracking-wider">
                <Brain className="w-4 h-4 text-[#0091cf]" />
                <span>AI Reasoning Coach</span>
              </span>
            </div>
            <button
              onClick={() => setShowExplanationInput(false)}
              className="text-xs font-mono text-[#787680] hover:text-[#070235] transition-colors"
            >
              Cancel
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Tell Lumora why you chose this answer..."
            className="w-full rounded-xl border border-[#c8c5d0] bg-white p-3.5 text-sm text-[#131b2e] placeholder-[#787680] focus:outline-none focus:ring-2 focus:ring-[#0091cf] focus:border-transparent transition-all shadow-inner"
            disabled={isSubmitting}
          />

          <div className="flex justify-end">
            <Button
              variant="theme"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-[#070235] hover:bg-[#1e1b4b] text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <span>{isSubmitting ? "Evaluating Thinking..." : "Check My Thinking →"}</span>
              <Sparkles className="w-4 h-4 text-[#fe932c]" />
            </Button>
          </div>
        </div>
      ) : feedback ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8ff] border-2 border-[#0091cf]/40 shadow-lg space-y-3.5 text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eaedff] pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#0091cf]" />
              <span className="font-extrabold text-sm sm:text-base text-[#070235] uppercase font-mono tracking-tight">
                🧠 LUMORA REASONING COACH
              </span>
            </div>
            {feedback.quality === "strong" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#059669]/10 text-[#059669] border border-[#059669]/30 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strong Reasoning
              </span>
            ) : feedback.quality === "needs_work" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fe932c]/15 text-[#904d00] border border-[#fe932c]/40 self-start sm:self-auto">
                <AlertCircle className="w-3.5 h-3.5 text-[#fe932c]" /> Needs Evidence
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0091cf]/10 text-[#0091cf] border border-[#0091cf]/30 self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-[#0091cf]" /> Developing Reasoning
              </span>
            )}
          </div>

          {/* Indicators */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold">
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                feedback.identified_evidence
                  ? "bg-[#059669]/10 border-[#059669]/30 text-[#059669]"
                  : "bg-[#eaedff] border-[#c8c5d0] text-[#787680]"
              }`}
            >
              <span>{feedback.identified_evidence ? "✓" : "○"}</span>
              <span>Evidence Cited</span>
            </div>
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                feedback.made_connection
                  ? "bg-[#059669]/10 border-[#059669]/30 text-[#059669]"
                  : "bg-[#eaedff] border-[#c8c5d0] text-[#787680]"
              }`}
            >
              <span>{feedback.made_connection ? "✓" : "○"}</span>
              <span>Logic Connected</span>
            </div>
          </div>

          {/* AI-Generated Feedback */}
          <div className="bg-white p-4 rounded-xl border border-[#c8c5d0]/70 text-sm text-[#131b2e] leading-relaxed shadow-sm">
            {feedback.feedback}
          </div>

          {/* AI-Generated Next Step */}
          {feedback.next_step && (
            <div className="bg-[#eaedff] p-3.5 rounded-xl border border-[#0091cf]/30 text-xs text-[#070235] leading-relaxed">
              <span className="font-extrabold text-[#070235] block mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#fe932c]" /> NEXT STEP
              </span>
              {feedback.next_step}
            </div>
          )}

          {feedback.is_fallback && (
            <p className="text-[11px] font-mono text-[#787680] text-center italic">
              Offline feedback generated.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ReasoningPrompt;
