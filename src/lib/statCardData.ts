import { ref, onValue } from "firebase/database";
import { db } from "./firebaseConfig";

export const getStatCardData = (
  id: string,
  callback: (data: string | number | null) => void
) => {
  const statCardRef = ref(db, `stat_cards/${id}/value`);

  onValue(statCardRef, (snapshot) => {
    const data = snapshot.val() as string | number | null;
    callback(data);
  });
};