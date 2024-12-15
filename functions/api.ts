import app from "../src/app";
import dotenv from "dotenv";
import serverless from "serverless-http";

// Charger les variables d'environnement
dotenv.config();

// Le handler requis par Netlify
export const handler = serverless(app);
