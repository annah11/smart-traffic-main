import { ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "./firebaseConfig";

export interface TrafficData {
  frame: number;
  lane_counts: number[];
}

export const getTrafficData = (
  callback: (data: { [key: string]: TrafficData } | null) => void
) => {
  const trafficRef = ref(db, "vehicle_data");

  onValue(trafficRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val() as { [key: string]: TrafficData } | null; 
    callback(data);
  });
};