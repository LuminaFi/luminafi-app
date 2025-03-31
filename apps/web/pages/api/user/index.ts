import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/firebaseAdmin";
import { Lender } from "~/lib/interfaces/lender.interface";
import { User } from "~/lib/interfaces/user.interface";
import userService from "~/services/user.service";

async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  const usersWithRoleData = await userService.fetchAllUsers();
  
  return res.status(200).json(usersWithRoleData);
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userName, walletAddress, fullName, role, transcript, essay, institutionName, amount } = req.body;

  const user: User = { userId, userName, walletAddress, fullName, role };
  const lender: Lender = { status: "proposed", amount, institutionName, transcriptUrl: transcript, essay };

  const newUser = await userService.createUser(user, lender);

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