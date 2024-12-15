import mongoose from "mongoose";
import { ISort, Sort } from "../models/Sort"; // Import du modèle Mongoose défini dans Sort.ts
import CustomError from "../utils/CustomError"; // Import de la classe CustomError

/**
 * Fonction permettant de récupérer un sort par ID.
 * @param id - ID unique du sort (ObjectId).
 * @returns Le sort correspondant ou null.
 * @throws CustomError - Si l'ID est invalide ou si le sort n'existe pas.
 */
async function getOne(id: string): Promise<ISort | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Format d'ID invalide.", 400);
  }

  const sort = await Sort.findById(id).exec();
  if (!sort) {
    throw new CustomError("Sort introuvable.", 404);
  }

  return sort;
}

/**
 * Méthode permettant de récupérer tous les sorts dans la BD.
 * @returns Une liste de tous les sorts.
 */
async function getAll(): Promise<ISort[]> {
  return await Sort.find().exec();
}

/**
 * Méthode permettant de récupérer des sorts en fonctions de filtres.
 * @param filters - Un objet contenant les filtres à appliquer (niveauDifficulte, categorie, estInterdit, etc.).
 * @returns Une liste de sorts correspondant aux filtres appliqués.
 * @throws Error - Si le filtre 'estInterdit' est mal formaté.
 */
async function getFiltered(filters: { [key: string]: any }): Promise<ISort[]> {
  const query: any = {}; // Prépare un objet de requête

  if (filters.niveauDifficulte) {
    const [min, max] = filters.niveauDifficulte.split("-").map(Number);
    if (min && max) {
      query.niveauDifficulte = { $gte: min, $lte: max };
    } else {
      query.niveauDifficulte = parseInt(filters.niveauDifficulte, 10);
    }
  }

  if (filters.categorie) {
    query.categorie = { $in: filters.categorie.split(",") };
  }

  if (filters.estInterdit !== undefined) {
    const cleanValue = filters.estInterdit.toString().trim(); // Pour enelever les espaces et /n
    if (cleanValue === "true") {
      query.estInterdit = true;
    } else if (cleanValue === "false") {
      query.estInterdit = false;
    } else {
      throw new Error("Le filtre 'estInterdit' doit être 'true' ou 'false'.");
    }
  }

  console.log("[DEBUG] Requête Mongo construite :", query);

  return await Sort.find(query).exec();
}

/**
 * Méthode permettant d'ajouter un nouveau sort dans la BD.
 * @param sort - Un objet contenant les données du sort.
 * @returns Le sort nouvellement ajouté.
 * @throws CustomError - Si la validation des données échoue.
 */
async function add(sort: ISort): Promise<ISort> {
  const newSort = new Sort(sort);
  try {
    return await newSort.save();
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new CustomError(
        "Validation des données du sort échouée.",
        400,
        Object.entries(error.errors).map(([field, err]) => ({
          field,
          message: (err as mongoose.Error.ValidatorError).message,
        }))
      );
    }
    console.error(`[ERROR] Erreur lors de l'ajout du sort :`, error.message);
    throw new CustomError("Erreur interne lors de l'ajout du sort.", 500);
  }
}

/**
 * Méthode permettant de mettre à jour un sort par son ID.
 * @param id - Identifiant unique du sort (au format ObjectId).
 * @param sort - Un objet partiel contenant les données à mettre à jour.
 * @returns Le sort mis à jour ou null.
 * @throws CustomError - Si l'ID est invalide, le sort n'existe pas ou si la validation échoue.
 */
async function update(id: string, sort: Partial<ISort>): Promise<ISort | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Format d'ID invalide.", 400);
  }

  try {
    const updatedSort = await Sort.findByIdAndUpdate(id, sort, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedSort) {
      throw new CustomError("Sort introuvable pour mise à jour.", 404);
    }

    return updatedSort;
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new CustomError(
        "Validation des données échouée lors de la mise à jour.",
        400,
        Object.entries(error.errors).map(([field, err]) => ({
          field,
          message: (err as mongoose.Error.ValidatorError).message,
        }))
      );
    }
    console.error(`[ERROR] Erreur lors de la mise à jour :`, error.message);
    throw new CustomError("Erreur interne lors de la mise à jour.", 500);
  }
}

/**
 * Méthode permettant de supprimer un sort par son ID.
 * @param id - Identifiant unique du sort (au format ObjectId).
 * @returns Le sort supprimé ou null.
 * @throws CustomError - Si l'ID est invalide ou si le sort n'existe pas.
 */
async function delete_(id: string): Promise<ISort | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Format d'ID invalide.", 400);
  }

  const deletedSort = await Sort.findByIdAndDelete(id).exec();
  if (!deletedSort) {
    throw new CustomError("Sort introuvable pour suppression.", 404);
  }

  return deletedSort;
}

// Export des fonctions
export default {
  getOne,
  getAll,
  getFiltered,
  add,
  update,
  delete: delete_,
};
