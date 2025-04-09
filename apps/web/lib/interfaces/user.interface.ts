export interface User {
  id?: string,
  userId: string,
  userName: string, 
  walletAddress: string, 
  fullName: string, 
  role: "lender" | "investor", 
  roleId?: "string",
}