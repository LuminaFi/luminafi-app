import { db } from "~/lib/firebaseAdmin";
import { Lender } from "~/lib/interfaces/lender.interface";
import { User } from "~/lib/interfaces/user.interface";
import _ from "lodash";

class UserService {
  async createLender(user: User, lender: Lender) { 
    await this.checkExistingUser(user);

    const newLender = await db.collection("lender").add(lender);
  
    const newUser = await db.collection("user").add({ ...user, roleId: newLender.id });
    return newUser.id;
  }

  async updateLender(id: string, user: User, lender: Lender) {
    const userSnapshot = await db.collection("user").doc(id).get();
    if (!userSnapshot.exists) { 
      throw new Error("User not found");
    }
    const userData = { id: userSnapshot.id, ...userSnapshot.data() as User };
    await this.checkExistingUser(user, userData.id);

    const lenderSnapshot = await db.collection("lender").doc(userData.roleId as string).get();
    if (!lenderSnapshot.exists) {
      throw new Error("Lender not found");
    }
    const lenderData = { id: lenderSnapshot.id, ...lenderSnapshot.data() as Lender };

    const updatedUser = { ...userData, ...user };
    const updatedLender = { ...lenderData, ...lender };
    await db.collection("user").doc(id).set(updatedUser);
    await db.collection("lender").doc(userData.roleId as string).set(updatedLender);
    
    return { ...updatedUser, roleData: updatedLender };
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
  
    const lenderSnapshot = await db.collection("lender").doc(user.roleId as string).get();
    const lender = { id: lenderSnapshot.id, ...lenderSnapshot.data() as Lender };
  
    return {
      ...user,
      roleData: lender,
    };
  }

  async deleteUser(id: string) {
    const userSnapshot = await db.collection("user").doc(id).get();
    if (!userSnapshot.exists) {
      throw new Error("User not found");
    }
    const user = { id: userSnapshot.id, ...userSnapshot.data() as User };
  
    await db.collection("user").doc(id).delete();
    await db.collection("lender").doc(user.roleId as string).delete();
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



