export interface Lender {
  id?: string,
  score?: number,
  institutionName: string,
  status: "proposed" | "accepted" | "rejected",
  amount: number,
  transcriptUrl?: string,
  essayUrl?: string
}