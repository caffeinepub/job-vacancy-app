import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PostForm {
  title: string;
  category: string;
  content: string;
}

const INITIAL: PostForm = { title: "", category: "", content: "" };

const CATEGORIES = [
  { value: "job-news", label: "Job News" },
  { value: "industry-update", label: "Industry Update" },
  { value: "tips-advice", label: "Tips & Advice" },
  { value: "other", label: "Other" },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "job-news": "Latest hiring news, company updates, and job market trends.",
  "industry-update":
    "Sector-specific developments, policy changes, and market insights.",
  "tips-advice": "Career advice, interview tips, resume writing guidance.",
  other: "General posts related to employment and careers in India.",
};

export function AddPostPanel() {
  const [form, setForm] = useState<PostForm>(INITIAL);

  function update(field: keyof PostForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Post published!", {
      description: `"${form.title}" is now visible to the community.`,
    });
    setForm(INITIAL);
  }

  function handleDraft() {
    if (!form.title.trim()) {
      toast.error("Please add a title before saving.");
      return;
    }
    toast.success("Draft saved", {
      description: "You can continue writing this post later.",
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Add a Post
        </h2>
        <p className="text-sm text-muted-foreground">
          Share job news, tips, and updates with the JobFinder community.
        </p>
      </div>

      <form onSubmit={handlePublish} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="post-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="post-title"
            placeholder="e.g. IT Hiring Boom in Bengaluru — Q1 2026"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label>
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) => update("category", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.category && (
            <p className="text-xs text-muted-foreground">
              {CATEGORY_DESCRIPTIONS[form.category]}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <Label htmlFor="post-content">
            Content <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="post-content"
            placeholder="Write your post content here. Share insights, tips, or news that will help job seekers across India..."
            rows={8}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className="resize-none"
            required
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.content.length} characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleDraft}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Publish Post
          </Button>
        </div>
      </form>
    </div>
  );
}
