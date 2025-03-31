import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/firebaseAdmin";
import { Lender } from "~/lib/interfaces/lender.interface";
import { User } from "~/lib/interfaces/user.interface";

async function getUserById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const userSnapshot = await db.collection("user").doc(id as string).get();
  const user = { id: userSnapshot.id, ...userSnapshot.data() as User };

  const lenderSnapshot = await db.collection("lender").doc(user.roleId).get();
  const lender = { id: lenderSnapshot.id, ...lenderSnapshot.data() as Lender };

  const credentialSnapshot = await db.collection("credential").doc(lender.credentialIds[0] as string).get();
  const credential = { id: credentialSnapshot.id, ...credentialSnapshot.data() };

  const loanSnapshot = await db.collection("loan").doc(lender.loanId as string).get();
  const loan = { id: loanSnapshot.id, ...loanSnapshot.data() };

  return res.status(200).json({
    ...user,
    role: lender,
    credentials: [credential],
    loan
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch(req.method) {
      case "GET":
        return getUserById(req, res);
    }
  
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}