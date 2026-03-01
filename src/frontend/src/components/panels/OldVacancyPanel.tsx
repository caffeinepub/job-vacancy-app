import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Building2, Calendar, Eye, MapPin } from "lucide-react";
import { toast } from "sonner";

interface PastVacancy {
  id: string;
  title: string;
  company: string;
  state: string;
  district: string;
  postedDate: string;
  closedDate: string;
  applicants: number;
}

const PAST_VACANCIES: PastVacancy[] = [
  {
    id: "pv-1",
    title: "Software Engineer",
    company: "TCS",
    state: "Karnataka",
    district: "Bengaluru",
    postedDate: "Jan 15, 2025",
    closedDate: "Feb 28, 2025",
    applicants: 142,
  },
  {
    id: "pv-2",
    title: "Product Manager",
    company: "Infosys",
    state: "Maharashtra",
    district: "Pune",
    postedDate: "Nov 5, 2024",
    closedDate: "Dec 20, 2024",
    applicants: 87,
  },
  {
    id: "pv-3",
    title: "Data Science Lead",
    company: "Wipro",
    state: "Delhi",
    district: "New Delhi",
    postedDate: "Sep 1, 2024",
    closedDate: "Oct 15, 2024",
    applicants: 214,
  },
];

export function OldVacancyPanel() {
  function handleViewApplications(title: string) {
    toast.info("Feature coming soon", {
      description: `Application details for "${title}" will be available soon.`,
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Old Vacancies
        </h2>
        <p className="text-sm text-muted-foreground">
          {PAST_VACANCIES.length} closed positions from your past listings.
        </p>
      </div>

      {/* Summary stat */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-secondary/60 border border-border text-center">
          <div className="text-2xl font-display font-bold text-foreground">
            {PAST_VACANCIES.length}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Closed Jobs
          </div>
        </div>
        <div className="p-4 rounded-xl bg-secondary/60 border border-border text-center">
          <div className="text-2xl font-display font-bold text-foreground">
            {PAST_VACANCIES.reduce((a, v) => a + v.applicants, 0)}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Total Applicants
          </div>
        </div>
      </div>

      {/* Vacancy Cards */}
      <div className="space-y-4">
        {PAST_VACANCIES.map((vacancy) => (
          <Card key={vacancy.id} className="shadow-xs border-border">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base font-semibold text-foreground leading-tight">
                    {vacancy.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                    {vacancy.company}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="flex-shrink-0 bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                >
                  <Archive className="w-3 h-3 mr-1" />
                  Closed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {vacancy.district}, {vacancy.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Posted {vacancy.postedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Closed {vacancy.closedDate}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-muted-foreground">
                  <span className="font-bold text-foreground text-sm">
                    {vacancy.applicants}
                  </span>{" "}
                  applicants received
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleViewApplications(vacancy.title)}
                >
                  <Eye className="w-3 h-3 mr-1.5" />
                  View Apps
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
