import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Edit, FileText, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

interface DraftVacancy {
  id: string;
  title: string;
  company: string;
  state: string;
  district: string;
  savedDate: string;
  completionPct: number;
}

const DRAFT_VACANCIES: DraftVacancy[] = [
  {
    id: "dv-1",
    title: "Senior React Developer",
    company: "Flipkart",
    state: "Karnataka",
    district: "Bengaluru",
    savedDate: "2 days ago",
    completionPct: 70,
  },
  {
    id: "dv-2",
    title: "Marketing Executive",
    company: "Reliance Digital",
    state: "Maharashtra",
    district: "Mumbai",
    savedDate: "1 week ago",
    completionPct: 45,
  },
];

export function DraftVacancyPanel() {
  function handleEdit(title: string) {
    toast.info("Feature coming soon", {
      description: `Editing "${title}" will be available in the next update.`,
    });
  }

  function handlePublish(title: string) {
    toast.success("Published successfully!", {
      description: `"${title}" is now live and visible to candidates.`,
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Draft Vacancies
        </h2>
        <p className="text-sm text-muted-foreground">
          {DRAFT_VACANCIES.length} saved drafts waiting to be published.
        </p>
      </div>

      {/* Draft Cards */}
      <div className="space-y-4">
        {DRAFT_VACANCIES.map((draft) => (
          <Card key={draft.id} className="shadow-xs border-border">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base font-semibold text-foreground leading-tight">
                    {draft.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                    {draft.company}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="flex-shrink-0 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Draft
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {draft.district}, {draft.state}
                </span>
                <span>Saved {draft.savedDate}</span>
              </div>

              {/* Completion indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Form completion</span>
                  <span className="font-semibold text-foreground">
                    {draft.completionPct}%
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${draft.completionPct}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleEdit(draft.title)}
                >
                  <Edit className="w-3 h-3 mr-1.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handlePublish(draft.title)}
                >
                  <Send className="w-3 h-3 mr-1.5" />
                  Publish
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state hint */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed text-center">
          Drafts are auto-saved when you click "Save as Draft" in New Vacancy.
          Unpublished jobs are never visible to candidates.
        </p>
      </div>
    </div>
  );
}
