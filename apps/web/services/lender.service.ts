import { db } from "./firebase.service";

class LenderService {
  async fetchLenderById(id: string) {
    const lenderSnapshot = await db.collection("lender").doc(id).get();
    if (!lenderSnapshot.exists) {
      console.log("Lender not found");
      return null;
    }
    const lender = { id: lenderSnapshot.id, ...lenderSnapshot.data() };

    return lender;
  }
}

const lenderService = new LenderService();
export default lenderService;