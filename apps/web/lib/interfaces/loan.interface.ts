export interface Loan {
  id?: string,
  status: "proposed" | "accepted" | "rejected",
  amount: number,
}