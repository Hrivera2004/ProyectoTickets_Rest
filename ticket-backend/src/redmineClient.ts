import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const REDMINE_URL = process.env.REDMINE_URL;
const REDMINE_API_KEY = process.env.REDMINE_API_KEY;

if (!REDMINE_URL || !REDMINE_API_KEY) {
  throw new Error(
    "Faltan REDMINE_URL o REDMINE_API_KEY. Verifica tu archivo .env"
  );
}

export const redmine = axios.create({
  baseURL: REDMINE_URL,
  headers: {
    "X-Redmine-API-Key": REDMINE_API_KEY,
  },
});

export const DEFAULT_PROJECT_ID = Number(process.env.REDMINE_PROJECT_ID) || 1;
