import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/firebaseAdmin";

async function getUserById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const snapshot = await db.collection("user").doc(id as string).get();
  const user = { id: snapshot.id, ...snapshot.data() };

  return res.status(200).json(user);
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