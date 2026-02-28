import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CheckCircle2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { JobListing } from "../data/jobs";
import { useActor } from "../hooks/useActor";

interface ApplyModalProps {
  job: JobListing | null;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeFile: File | null;
}

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  coverLetter: "",
  resumeFile: null,
};

interface FieldError {
  fullName?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
}

export function ApplyModal({ job, onClose }: ApplyModalProps) {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isOpen = job !== null;

  function handleClose() {
    if (status === "loading") return;
    setForm(initialForm);
    setErrors({});
    setStatus("idle");
    setErrorMsg("");
    onClose();
  }

  function validate(): boolean {
    const e: FieldError = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.coverLetter.trim()) e.coverLetter = "Cover letter is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job || !validate()) return;

    setStatus("loading");
    try {
      if (!actor) {
        setStatus("error");
        setErrorMsg("Backend not available. Please try again.");
        return;
      }
      const result = await actor.submitApplication(
        job.jobId,
        form.fullName,
        form.email,
        form.phone,
        form.coverLetter,
      );
      if (result.__kind__ === "ok") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, resumeFile: file }));
  }

  function removeFile() {
    setForm((prev) => ({ ...prev, resumeFile: null }));
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-foreground leading-tight font-display">
                Apply for {job?.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {job?.company}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center py-8 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground font-display">
                    Application Submitted!
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    Your application for <strong>{job?.title}</strong> at{" "}
                    <strong>{job?.company}</strong> has been received.
                    We&apos;ll be in touch soon!
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Done
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Ahmad Farid bin Abdullah"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    className={errors.fullName ? "border-destructive" : ""}
                    autoComplete="name"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmad@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className={errors.email ? "border-destructive" : ""}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+60 12-345 6789"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className={errors.phone ? "border-destructive" : ""}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Resume Upload */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Resume / CV{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  {form.resumeFile ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-secondary/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {form.resumeFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(form.resumeFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={removeFile}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="resume"
                      className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground text-center">
                        Click to upload or drag & drop
                        <br />
                        <span className="text-xs">
                          .pdf, .doc, .docx accepted
                        </span>
                      </span>
                      <input
                        id="resume"
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                {/* Cover Letter */}
                <div className="space-y-1.5">
                  <Label htmlFor="coverLetter" className="text-sm font-medium">
                    Cover Letter <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're the perfect fit for this role..."
                    value={form.coverLetter}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, coverLetter: e.target.value }))
                    }
                    rows={5}
                    className={`resize-none ${errors.coverLetter ? "border-destructive" : ""}`}
                  />
                  {errors.coverLetter && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.coverLetter}
                    </p>
                  )}
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive">{errorMsg}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={status === "loading"}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
