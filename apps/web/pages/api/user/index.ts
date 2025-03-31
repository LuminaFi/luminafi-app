import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/firebaseAdmin";

async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await db.collection("user").get();
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return res.status(200).json(users);
}

// maybe need transaction?
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userName, walletAddress, fullName, role, credentials, institutionName, amount } = req.body;

  const newCredential = await db.collection("credential").add({ type: credentials[0].type, url: credentials[0].url });
  
  const newLoan = await db.collection("loan").add({ status: "proposed", amount });

  const newLender = await db.collection("lender").add({ loanId: newLoan.id, credentialIds: [newCredential.id], institutionName });

  const userRef = await db.collection("user").add({ userId, userName, walletAddress, fullName, role, roleId: newLender.id });
  const user = { id: userRef.id, userId, userName, walletAddress, fullName, role, roleId: newLender.id };

  return res.status(201).json(user);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch(req.method) {
      case "GET":
        return getAllUsers(req, res);
      case "POST":
        return createUser(req, res);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}