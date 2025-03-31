import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/firebaseAdmin";

async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await db.collection("user").get();
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return res.status(200).json(users);
}

// maybe need transaction?
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userName, walletAddress, fullName, role, roleId } = req.body;

  const newUserRef = await db.collection("user").add({ userId, userName, walletAddress, fullName, role, roleId });
  const newUser = { id: newUserRef.id, userId, userName, walletAddress, fullName, role, roleId };

  return res.status(201).json(newUser);
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