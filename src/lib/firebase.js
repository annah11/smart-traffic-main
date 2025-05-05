import { getDatabase, ref, onValue } from "firebase/database";

export const getTrafficData = (callback) => {
  const db = getDatabase();
  const trafficRef = ref(db, "vehicle_data"); 
  onValue(trafficRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};