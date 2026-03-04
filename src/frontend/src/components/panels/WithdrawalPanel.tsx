import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Building2,
  Clock,
  History,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Screen = "select" | "upi" | "bank" | "history";

interface WithdrawalPanelProps {
  onBack: () => void;
  initialScreen?: Screen;
}

interface BankRequest {
  user_id: string;
  withdrawal_method: "BANK";
  account_holder_name: string;
  ifsc_code: string;
  account_number: string;
  withdrawal_amount: number;
  request_date: string;
}

interface UpiRequest {
  user_id: string;
  withdrawal_method: "UPI";
  upi_id: string;
  account_holder_name: string;
  withdrawal_amount: number;
  request_date: string;
}

function getUserId(): string {
  try {
    const raw = localStorage.getItem("jf_user");
    if (raw) {
      const parsed = JSON.parse(raw) as { user_id?: string };
      if (parsed.user_id) return parsed.user_id;
    }
  } catch {
    // ignore
  }
  return "guest";
}

// ─── Earnings balance card (shared) ─────────────────────────────────────────
function EarningsCard() {
  return (
    <Card className="rounded-2xl shadow-md border border-border overflow-hidden">
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.42 0.15 158) 0%, oklch(0.52 0.18 162) 100%)",
        }}
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
        <CardContent className="relative z-10 px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
              Your Earnings Balance
            </p>
          </div>
          <p className="text-5xl font-extrabold text-white tracking-tight">
            ₹0.00
          </p>
          <p className="text-white/65 text-xs mt-1.5">
            Refer friends to increase your balance
          </p>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── Method selection screen ─────────────────────────────────────────────────
function SelectMethodScreen({
  onSelect,
  onBack,
  onViewHistory,
}: {
  onSelect: (method: "upi" | "bank") => void;
  onBack: () => void;
  onViewHistory: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
        <button
          type="button"
          onClick={onBack}
          data-ocid="withdrawal.select.back_button"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
          aria-label="Back to Refer & Earn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-base font-bold text-foreground tracking-tight">
            Withdrawal
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <EarningsCard />

        {/* Method selection */}
        <Card className="rounded-2xl shadow-md border border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-bold text-foreground">
              Select Withdrawal Method
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose how you want to receive your earnings
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-5 space-y-3">
            {/* UPI option */}
            <button
              type="button"
              data-ocid="withdrawal.select.upi_button"
              onClick={() => onSelect("upi")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors">
                <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">
                  UPI Withdrawal
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Instant transfer to your UPI ID
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Bank option */}
            <button
              type="button"
              data-ocid="withdrawal.select.bank_button"
              onClick={() => onSelect("bank")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-900/10 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">
                  Bank Withdrawal
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Transfer to your bank account (3-5 days)
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          </CardContent>
        </Card>

        {/* Info note */}
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Minimum withdrawal: <span className="font-semibold">₹100</span>.
            Ensure your details are correct before submitting.
          </p>
        </div>

        {/* View History button */}
        <button
          type="button"
          data-ocid="withdrawal.select.view_history_button"
          onClick={onViewHistory}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-border hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10 text-sm font-semibold text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
        >
          <History className="w-4 h-4" />
          View Withdrawal History
        </button>

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── UPI form screen ──────────────────────────────────────────────────────────
function UpiFormScreen({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    upiId: "",
    accountHolderName: "",
    withdrawalAmount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }
    if (!form.upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }
    if (!form.accountHolderName.trim()) {
      toast.error("Please enter the account holder name");
      return;
    }
    const amount = Number.parseFloat(form.withdrawalAmount);
    if (!form.withdrawalAmount || Number.isNaN(amount) || amount <= 0) {
      toast.error("Withdrawal amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const request: UpiRequest = {
      user_id: getUserId(),
      withdrawal_method: "UPI",
      upi_id: form.upiId.trim(),
      account_holder_name: form.accountHolderName.trim(),
      withdrawal_amount: amount,
      request_date: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("jf_withdrawal_requests") ?? "[]",
      ) as (UpiRequest | BankRequest)[];
      existing.push(request);
      localStorage.setItem("jf_withdrawal_requests", JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Withdrawal request submitted successfully");
    setForm({ upiId: "", accountHolderName: "", withdrawalAmount: "" });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
        <button
          type="button"
          onClick={onBack}
          data-ocid="withdrawal.upi.back_button"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
          aria-label="Back to method selection"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-base font-bold text-foreground tracking-tight">
            UPI Withdrawal
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <EarningsCard />

        {/* Success message */}
        {submitted && (
          <div
            data-ocid="withdrawal.upi.success_state"
            className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 px-5 py-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                viewBox="0 0 20 20"
                fill="white"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                Withdrawal request submitted successfully
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                Your UPI request has been saved and will be processed soon.
              </p>
            </div>
          </div>
        )}

        {/* UPI Form */}
        <Card className="rounded-2xl shadow-md border border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-bold text-foreground">
              UPI Withdrawal Request
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your UPI details to submit a withdrawal request
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-5">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              noValidate
              data-ocid="withdrawal.upi.form"
            >
              {/* UPI ID */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="upi-id"
                  className="text-sm font-medium text-foreground"
                >
                  UPI ID
                </Label>
                <Input
                  id="upi-id"
                  data-ocid="withdrawal.upi_id.input"
                  type="text"
                  placeholder="e.g. name@upi"
                  value={form.upiId}
                  onChange={(e) => handleChange("upiId", e.target.value)}
                  className="h-11 rounded-xl border-border text-sm"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <p className="text-xs text-muted-foreground">
                  Your UPI ID as registered with your bank
                </p>
              </div>

              {/* Account Holder Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="upi-holder-name"
                  className="text-sm font-medium text-foreground"
                >
                  Account Holder Name
                </Label>
                <Input
                  id="upi-holder-name"
                  data-ocid="withdrawal.upi.account_holder_name.input"
                  type="text"
                  placeholder="Enter account holder name"
                  value={form.accountHolderName}
                  onChange={(e) =>
                    handleChange("accountHolderName", e.target.value)
                  }
                  className="h-11 rounded-xl border-border text-sm"
                  autoComplete="name"
                />
              </div>

              {/* Withdrawal Amount */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="upi-amount"
                  className="text-sm font-medium text-foreground"
                >
                  Withdrawal Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground pointer-events-none">
                    ₹
                  </span>
                  <Input
                    id="upi-amount"
                    data-ocid="withdrawal.upi.withdrawal_amount.input"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Enter amount"
                    value={form.withdrawalAmount}
                    onChange={(e) =>
                      handleChange("withdrawalAmount", e.target.value)
                    }
                    className="h-11 rounded-xl border-border text-sm pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Amount must be greater than{" "}
                  <span className="font-semibold text-foreground/70">₹0</span>
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                data-ocid="withdrawal.upi.submit_button"
                className="w-full h-12 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Withdrawal Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info note */}
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            UPI withdrawals are typically processed within{" "}
            <span className="font-semibold">24 hours</span>. Ensure your UPI ID
            is correct before submitting.
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── Bank form screen ─────────────────────────────────────────────────────────
function BankFormScreen({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    accountHolderName: "",
    ifscCode: "",
    accountNumber: "",
    withdrawalAmount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.accountHolderName.trim()) {
      toast.error("Please enter the account holder name");
      return;
    }
    const ifsc = form.ifscCode.trim().toUpperCase();
    if (!ifsc) {
      toast.error("Please enter the IFSC code");
      return;
    }
    if (!form.accountNumber.trim()) {
      toast.error("Please enter the bank account number");
      return;
    }
    const amount = Number.parseFloat(form.withdrawalAmount);
    if (!form.withdrawalAmount || Number.isNaN(amount) || amount <= 0) {
      toast.error("Withdrawal amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const request: BankRequest = {
      user_id: getUserId(),
      withdrawal_method: "BANK",
      account_holder_name: form.accountHolderName.trim(),
      ifsc_code: ifsc,
      account_number: form.accountNumber.trim(),
      withdrawal_amount: amount,
      request_date: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("jf_withdrawal_requests") ?? "[]",
      ) as (UpiRequest | BankRequest)[];
      existing.push(request);
      localStorage.setItem("jf_withdrawal_requests", JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Withdrawal request submitted successfully");
    setForm({
      accountHolderName: "",
      ifscCode: "",
      accountNumber: "",
      withdrawalAmount: "",
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
        <button
          type="button"
          onClick={onBack}
          data-ocid="withdrawal.bank.back_button"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
          aria-label="Back to method selection"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-base font-bold text-foreground tracking-tight">
            Bank Withdrawal
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <EarningsCard />

        {/* Success message */}
        {submitted && (
          <div
            data-ocid="withdrawal.bank.success_state"
            className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 px-5 py-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                viewBox="0 0 20 20"
                fill="white"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                Withdrawal request submitted successfully
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                Your request has been saved and will be processed soon.
              </p>
            </div>
          </div>
        )}

        {/* Bank Form */}
        <Card className="rounded-2xl shadow-md border border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-bold text-foreground">
              Bank Withdrawal Request
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your bank details to submit a withdrawal request
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-5">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              noValidate
              data-ocid="withdrawal.bank.form"
            >
              {/* Account Holder Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="bank-holder-name"
                  className="text-sm font-medium text-foreground"
                >
                  Account Holder Name
                </Label>
                <Input
                  id="bank-holder-name"
                  data-ocid="withdrawal.bank.account_holder_name.input"
                  type="text"
                  placeholder="Enter account holder name"
                  value={form.accountHolderName}
                  onChange={(e) =>
                    handleChange("accountHolderName", e.target.value)
                  }
                  className="h-11 rounded-xl border-border text-sm"
                  autoComplete="name"
                />
              </div>

              {/* IFSC Code */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="bank-ifsc"
                  className="text-sm font-medium text-foreground"
                >
                  IFSC Code
                </Label>
                <Input
                  id="bank-ifsc"
                  data-ocid="withdrawal.bank.ifsc_code.input"
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={form.ifscCode}
                  onChange={(e) =>
                    handleChange("ifscCode", e.target.value.toUpperCase())
                  }
                  className="h-11 rounded-xl border-border text-sm font-mono tracking-widest"
                  maxLength={11}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <p className="text-xs text-muted-foreground">
                  11-character code found on your cheque book or bank passbook
                </p>
              </div>

              {/* Bank Account Number */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="bank-account-number"
                  className="text-sm font-medium text-foreground"
                >
                  Bank Account Number
                </Label>
                <Input
                  id="bank-account-number"
                  data-ocid="withdrawal.bank.account_number.input"
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter your account number"
                  value={form.accountNumber}
                  onChange={(e) =>
                    handleChange("accountNumber", e.target.value)
                  }
                  className="h-11 rounded-xl border-border text-sm"
                  autoComplete="off"
                />
              </div>

              {/* Withdrawal Amount */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="bank-amount"
                  className="text-sm font-medium text-foreground"
                >
                  Withdrawal Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground pointer-events-none">
                    ₹
                  </span>
                  <Input
                    id="bank-amount"
                    data-ocid="withdrawal.bank.withdrawal_amount.input"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Enter amount"
                    value={form.withdrawalAmount}
                    onChange={(e) =>
                      handleChange("withdrawalAmount", e.target.value)
                    }
                    className="h-11 rounded-xl border-border text-sm pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Amount must be greater than{" "}
                  <span className="font-semibold text-foreground/70">₹0</span>
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                data-ocid="withdrawal.bank.submit_button"
                className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Withdrawal Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info note */}
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Bank withdrawals are processed within{" "}
            <span className="font-semibold">3-5 business days</span>. Ensure
            your bank details are correct before submitting.
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── History screen ───────────────────────────────────────────────────────────
type WithdrawalRequest = (UpiRequest | BankRequest) & { status?: string };

function WithdrawalHistoryScreen({ onBack }: { onBack: () => void }) {
  const [history] = useState<WithdrawalRequest[]>(() => {
    try {
      const raw = localStorage.getItem("jf_withdrawal_requests");
      if (raw) return JSON.parse(raw) as WithdrawalRequest[];
    } catch {
      // ignore
    }
    return [];
  });

  function formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="flex flex-col h-full" data-ocid="withdrawal.history.panel">
      {/* Sticky header */}
      <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
        <button
          type="button"
          onClick={onBack}
          data-ocid="withdrawal.history.back_button"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
          aria-label="Back to withdrawal options"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-bold text-foreground tracking-tight">
            Withdrawal History
          </h2>
        </div>
        {history.length > 0 && (
          <span className="ml-auto text-xs font-semibold bg-muted text-muted-foreground rounded-full px-2 py-0.5">
            {history.length}
          </span>
        )}
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {history.length === 0 ? (
          /* Empty state */
          <div
            data-ocid="withdrawal.history.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center px-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              No withdrawal history available.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Your submitted withdrawal requests will appear here once you make
              your first request.
            </p>
          </div>
        ) : (
          /* History list */
          <div className="space-y-2" data-ocid="withdrawal.history.list">
            {[...history].reverse().map((req, idx) => {
              const isUpi = req.withdrawal_method === "UPI";
              const reversedIdx = history.length - idx;
              return (
                <Card
                  key={`${req.request_date}-${idx}`}
                  className="rounded-2xl border border-border shadow-sm overflow-hidden"
                  data-ocid={`withdrawal.history.item.${reversedIdx}`}
                >
                  <CardContent className="px-4 py-3">
                    {/* Top row: method badge + amount + status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {/* Method badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isUpi
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {isUpi ? (
                            <Smartphone className="w-3 h-3" />
                          ) : (
                            <Building2 className="w-3 h-3" />
                          )}
                          {isUpi ? "UPI" : "BANK"}
                        </span>

                        {/* Status badge */}
                        <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Pending
                        </span>
                      </div>

                      {/* Amount */}
                      <p className="text-base font-extrabold text-foreground tabular-nums">
                        ₹{req.withdrawal_amount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Details row */}
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="font-medium text-foreground/70">
                          Name:
                        </span>{" "}
                        {req.account_holder_name}
                      </p>
                      {isUpi && (req as UpiRequest).upi_id && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="font-medium text-foreground/70">
                            UPI ID:
                          </span>{" "}
                          <span className="font-mono">
                            {(req as UpiRequest).upi_id}
                          </span>
                        </p>
                      )}
                      {!isUpi && (req as BankRequest).ifsc_code && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="font-medium text-foreground/70">
                            IFSC:
                          </span>{" "}
                          <span className="font-mono tracking-wider">
                            {(req as BankRequest).ifsc_code}
                          </span>
                        </p>
                      )}
                      {/* Date */}
                      <p className="text-xs text-muted-foreground/70 pt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {formatDate(req.request_date)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── Root panel ───────────────────────────────────────────────────────────────
export function WithdrawalPanel({
  onBack,
  initialScreen = "select",
}: WithdrawalPanelProps) {
  const [screen, setScreen] = useState<Screen>(initialScreen);

  if (screen === "upi") {
    return <UpiFormScreen onBack={() => setScreen("select")} />;
  }

  if (screen === "bank") {
    return <BankFormScreen onBack={() => setScreen("select")} />;
  }

  if (screen === "history") {
    return <WithdrawalHistoryScreen onBack={() => setScreen("select")} />;
  }

  return (
    <SelectMethodScreen
      onBack={onBack}
      onSelect={(method) => setScreen(method)}
      onViewHistory={() => setScreen("history")}
    />
  );
}
