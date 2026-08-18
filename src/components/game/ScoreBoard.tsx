import { Card } from "@/components/ui/Card";

interface ScoreBoardProps {
  score: number;
  totalQuestions: number;
}

export function ScoreBoard({ score, totalQuestions }: ScoreBoardProps) {
  const maxScore = totalQuestions * 10;

  return (
    <Card className="sticky top-24">
      <div className="space-y-4">
        <div>
          <p className="label-sm text-text-subtle mb-1">Skor Saat Ini</p>
          <p
            className="text-display-lg text-text-primary"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Skor saat ini: ${score} dari ${maxScore} poin`}
          >
            {score}
          </p>
          <p className="text-sm text-text-muted mt-1">dari {maxScore} poin maksimal</p>
        </div>

        <div className="h-px bg-border" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="label-sm text-text-subtle">Progress</span>
            <span className="label-sm text-text-secondary">
              {Math.round((score / maxScore) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(score / maxScore) * 100}%` }}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={maxScore}
              aria-label="Progress kuis"
            />
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Soal Dijawab</span>
          <span className="text-sm font-semibold text-text-primary">
            {Math.round(score / 10)} / {totalQuestions}
          </span>
        </div>
      </div>
    </Card>
  );
}
