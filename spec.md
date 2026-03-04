# Job Vacancy App

## Current State

The Refer & Earn panel (`ReferEarnPanel.tsx`) has a Wallet card (Panel 4) with two buttons side-by-side:
- **Withdraw** -- correctly calls `onWithdraw()` which navigates to the `withdrawal` panel
- **View History** -- has NO `onClick` handler, so clicking it does nothing

The `WithdrawalPanel.tsx` manages three internal screens via local state: `select`, `upi`, `bank`. Withdrawal requests are saved to `localStorage` under key `jf_withdrawal_requests` as an array of `UpiRequest | BankRequest` objects, each with:
- `user_id`, `withdrawal_method` ("UPI" | "BANK"), `withdrawal_amount`, `request_date`
- UPI: `upi_id`, `account_holder_name`
- BANK: `account_holder_name`, `ifsc_code`, `account_number`

`PanelSheet.tsx` handles navigation between panels using `onNavigate(panelId)`. The `withdrawal` panel is already registered in `PANEL_META`. Navigation from Refer & Earn → Withdrawal already works.

## Requested Changes (Diff)

### Add
- A `WithdrawalHistoryScreen` component inside `WithdrawalPanel.tsx` — a new internal screen (`history`) that:
  - Reads all records from `localStorage["jf_withdrawal_requests"]`
  - Displays each request as a card row with: Date (formatted), Amount (₹), Method (UPI / Bank), Status badge (Pending by default since no approval system exists yet)
  - Shows "No withdrawal history available." empty state when the array is empty
  - Has a Back button (returns to `select` screen)
  - Is fully scrollable on mobile

### Modify
- `WithdrawalPanel.tsx`: Add `"history"` to the `Screen` type union. Add `history` branch to render `WithdrawalHistoryScreen`. Pass `onViewHistory` callback into `SelectMethodScreen`.
- `ReferEarnPanel.tsx`: Add `onViewHistory?: () => void` prop. Wire the "View History" button `onClick` to call `onViewHistory()`.
- `PanelSheet.tsx`: Pass `onViewHistory` to `ReferEarnPanel` — it should call `onNavigate?.("withdrawal-history")`. OR simpler: keep history as an internal screen within `WithdrawalPanel` itself. The cleanest approach is to add a `initialScreen` prop to `WithdrawalPanel` so when called from "View History" it opens directly on the `history` screen. Then add a `withdrawal-history` navigate shortcut or pass `onViewHistory` to `ReferEarnPanel` that opens `withdrawal` panel with history screen.

  **Chosen approach**: Add `onViewHistory` prop to `ReferEarnPanel` that navigates to `withdrawal` panel, and add `initialScreen` prop to `WithdrawalPanel` so PanelSheet can pass `"history"` when coming from View History. Track `viewHistoryMode` in PanelSheet state.

### Remove
- Nothing removed

## Implementation Plan

1. **`WithdrawalPanel.tsx`**:
   - Add `"history"` to `Screen` type
   - Add optional `initialScreen?: Screen` prop to `WithdrawalPanel`
   - Initialize `screen` state with `initialScreen ?? "select"`
   - Build `WithdrawalHistoryScreen` component:
     - Reads `jf_withdrawal_requests` from localStorage on mount
     - Renders scrollable list of history cards (Date, Amount, Method chip, Status badge "Pending")
     - Empty state: "No withdrawal history available."
     - Back button → goes to `select` screen
   - Add `history` branch in root render

2. **`ReferEarnPanel.tsx`**:
   - Add `onViewHistory?: () => void` prop alongside existing `onWithdraw`
   - Wire `onClick={onViewHistory}` to the "View History" button

3. **`PanelSheet.tsx`**:
   - Add local state `withdrawalInitialScreen: "select" | "history"` (default `"select"`)
   - Pass `onViewHistory` to `ReferEarnPanel` that sets `withdrawalInitialScreen = "history"` then calls `onNavigate?.("withdrawal")`
   - Pass `initialScreen={withdrawalInitialScreen}` to `WithdrawalPanel`
   - Reset `withdrawalInitialScreen` back to `"select"` when withdrawal panel closes (onBack)
