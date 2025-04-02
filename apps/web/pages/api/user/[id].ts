import { NextApiRequest, NextApiResponse } from "next";
import userService from "~/services/user.service";

async function getUserById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const user = await userService.fetchUserById(id as string);

  return res.status(200).json(user);
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await userService.deleteUser(id as string);

  return res.status(204).end();
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userId, userName, walletAddress, fullName, role, transcriptUrl, essayUrl, institutionName, amount, status } = req.body;

  const user = { userId, userName, walletAddress, fullName, role };
  const lender = { status, amount, institutionName, transcriptUrl, essayUrl };

  const updatedUser = await userService.updateUser(id as string, user, lender);

  return res.status(200).json(updatedUser);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch(req.method) {
      case "GET":
        return getUserById(req, res);
      case "DELETE":
        return deleteUser(req, res);
      case "PUT":
        return updateUser(req, res);
    }
  
    res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}