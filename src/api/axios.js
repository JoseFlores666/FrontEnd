import axios from "axios";
import { API_URL } from "../config";


const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,//para que restablesca las cookies alli
});

export default instance;
