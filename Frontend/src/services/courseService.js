import http from "./httpService";
import { apiURL } from "../config.json";

export function getCourses() {
  return http.get(apiURL + "/courses");
}
