import { ref, onValue, set } from "firebase/database";
import { db } from "./firebaseConfig";
import type { TrafficLightMode, TrafficLightColor, TrafficLight, TrafficLightStatus } from "@/utils/types"; // Adjust path

export const getTrafficLightData = (
  id: string,
  callback: (data: TrafficLight | null) => void
) => {
  const trafficLightRef = ref(db, `traffic_lights/${id}`);

  onValue(trafficLightRef, (snapshot) => {
    const data = snapshot.val() as TrafficLight | null;
    callback(data);
  });
};

export const updateTrafficLightMode = (
  id: string,
  mode: TrafficLightMode
) => {
  const trafficLightRef = ref(db, `traffic_lights/${id}/mode`);
  return set(trafficLightRef, mode); 
};

export const updateTrafficLightLight = (
  id: string,
  light: TrafficLightColor
) => {
  const trafficLightRef = ref(db, `traffic_lights/${id}/currentLight`);
  return set(trafficLightRef, light); 
};

export const updateTrafficLightTimeLeft = (
  id: string,
  timeLeft: number
) => {
  const trafficLightRef = ref(db, `traffic_lights/${id}/timeLeft`);
  return set(trafficLightRef, timeLeft);
};