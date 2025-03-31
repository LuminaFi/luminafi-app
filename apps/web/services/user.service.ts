import { db } from "~/lib/firebaseAdmin";
import { Lender } from "~/lib/interfaces/lender.interface";
import { User } from "~/lib/interfaces/user.interface";
import _ from "lodash";

class UserService {
  async createUser(user: User, lender: Lender) {
    console.log(lender);
    const newLender = await db.collection("lender").add(lender);
  
    const userRef = await db.collection("user").add({ ...user, roleId: newLender.id });
    return userRef.id;
  }
  
  async fetchUserById(id: string) {
    const userSnapshot = await db.collection("user").doc(id).get();
    const user = { id: userSnapshot.id, ...userSnapshot.data() as User };
  
    const lenderSnapshot = await db.collection("lender").doc(user.roleId as string).get();
    const lender = { id: lenderSnapshot.id, ...lenderSnapshot.data() as Lender };
  
    return {
      ...user,
      roleData: lender,
    };
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
}

const userService = new UserService();
export default userService;



