import { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "../common/Paths";
import SortRoute from "./SortRoute";

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();


const sortRouter = Router();

// Extraire tous les sortilèges
sortRouter.get(Paths.Sorts.Get, (req, res) => SortRoute.getAll(req, res));

// Extraire un sortilège par son ID
sortRouter.get(Paths.Sorts.GetById, SortRoute.getById);

// Ajouter un sortilège
sortRouter.post(
  Paths.Sorts.Add,
  (req, res) => SortRoute.add(req, res)
);

// Mettre à jour un sortilège
sortRouter.put(
  Paths.Sorts.Update,
  (req, res, next) => {
    console.log("[DEBUG] Corps reçu pour validation:", req.body);
    next();
  },
  (req, res) => SortRoute.update(req, res)
);

// Supprimer un sortilège
sortRouter.delete(
  Paths.Sorts.Delete,
  validate(["id", "string", "params"]),
  (req, res) => SortRoute.delete(req, res)
);

// Ajouter les routes pour les sorts dans l'API
apiRouter.use(Paths.Sorts.Base, sortRouter);

// **** Export default **** //

export default apiRouter;
