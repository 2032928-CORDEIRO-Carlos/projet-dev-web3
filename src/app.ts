import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./routes";
import errorMiddleware from "./middlewares/errorMiddleware";

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Connexion à MongoDB
const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/projet-dev-web3";

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connecté à MongoDB");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err.message);
  });

// Middleware JSON
app.use(express.json());

// Configuration de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Le frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes API
app.use("/api", apiRouter);

// Gestion des erreurs
app.use(errorMiddleware);

export default app;
