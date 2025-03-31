export interface Lender {
  id?: string,
  loanId: string,
  credentialIds: string[],
  score?: number,
  institutionName: string,
}