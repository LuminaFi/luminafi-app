export interface Loan {
  status: "proposed" | "accepted" | "rejected",
  amount: number,
}