import { db } from "~/services/firebase.service";
import { Lender } from "~/lib/interfaces/lender.interface";
import { User } from "~/lib/interfaces/user.interface";
import _ from "lodash";
import lenderService from "./lender.service";

class UserService {
  async createUser(user: User, lender: Lender) { 
    await this.checkExistingUser(user);

    let roleSnapshot;
    if (user.role === "lender") {
      roleSnapshot = await db.collection("lender").add(lender);
    }
  
    const newUser = await db.collection("user").add({ ...user, roleId: roleSnapshot?.id });
    return newUser.id;
  }

  async updateUser(id: string, user: User, lender: Lender) {
    const userSnapshot = await db.collection("user").doc(id).get();
    if (!userSnapshot.exists) { 
      throw new Error("User not found");
    }
    const userData = { id: userSnapshot.id, ...userSnapshot.data() as User };
    await this.checkExistingUser(user, userData.id);

    let roleData;
    if (userData.role === "lender") {
      const lenderData = await lenderService.fetchLenderById(userData.roleId as string);
      if (!lenderData) {
        throw new Error("Lender not found");
      }

      roleData = { ...lenderData, ...lender };
      await db.collection("lender").doc(userData.roleId as string).set(roleData);
    }
    
    const updatedUser = { ...userData, ...user };
    await db.collection("user").doc(id).set(updatedUser);
    
    
    return { ...updatedUser, roleData };
  }
  
  async fetchAllUsers() {
    const userSnapshot = await db.collection("user").get();
    const users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const lenderSnapshot = await db.collection("lender").get();
    const lenders = lenderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const lendersById = _.keyBy(lenders, "id");
    const usersWithRoleData = _.map(users, (user: User) => ({
      ...user,
      roleData: lendersById[user.roleId as string] || null
    }));

    return usersWithRoleData;
  }

  async fetchUserById(id: string) {
    const userSnapshot = await db.collection("user").doc(id).get();
    if (!userSnapshot.exists) {
      throw new Error("User not found");
    }
    const user = { id: userSnapshot.id, ...userSnapshot.data() as User };
  
    let roleData;
    if (user.role === "lender") {
      roleData = await lenderService.fetchLenderById(user.roleId as string);
    }
  
    return {
      ...user,
      roleData,
    };
  }

  async deleteUser(id: string) {
    const userRef = db.collection("user").doc(id);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      throw new Error("User not found");
    }
    const user = { id: userSnapshot.id, ...userSnapshot.data() as User };

    if (user.role === "lender") {
      const lender = await lenderService.fetchLenderById(user.roleId as string);
      if (lender) {
        await db.collection("lender").doc(user.roleId as string).delete();
      }
    }
  
    await userRef.delete();
  }

  private async checkExistingUser(user: User, userId?: string) {
    const userRef = db.collection("user");
    const queries = [
      userRef.where("userId", "==", user.userId).limit(1).get(),
      userRef.where("userName", "==", user.userName).limit(1).get(),
      userRef.where("walletAddress", "==", user.walletAddress).limit(1).get(),
    ];
    for (const query of queries) {
      const snapshot = await query;
      if (snapshot.empty) continue;

      const existingUser = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as User }));
      if (existingUser[0]?.id !== userId) {
        throw new Error("User already exists");
      }
    }
  }
}

const userService = new UserService();
export default userService;



