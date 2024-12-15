import SortRepo from "../repos/SortRepo";
import { ISort } from "../models/Sort";
import mongoose from "mongoose";
import CustomError from "../utils/CustomError";

async function getAll(): Promise<ISort[]> {
  console.log("[DEBUG] Appel à getAll dans SortService");
  return await SortRepo.getAll();
}

async function getFiltered(filters: Partial<ISort>): Promise<ISort[]> {
  console.log("[DEBUG] Appel à getFiltered dans SortService avec filtres:", filters);

  if (filters.estInterdit !== undefined) {
    filters.estInterdit = filters.estInterdit.toString().trim() === "true";
  }
  

  return await SortRepo.getFiltered(filters);
}


async function getById(id: string): Promise<ISort | null> {
  console.log(`[DEBUG] Appel à getById dans SortService avec l'ID : ${id}`);
  if (!mongoose.isValidObjectId(id)) {
    throw new CustomError("L'ID fourni est invalide.", 400);
  }

  const sort = await SortRepo.getOne(id);
  if (!sort) {
    throw new CustomError("Sort introuvable.", 404);
  }

  return sort;
}

async function add(sort: ISort): Promise<ISort> {
  console.log("[DEBUG] Appel à add dans SortService avec les données :", sort);

  try {
    return await SortRepo.add(sort);
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new CustomError(
        "Les données du sort sont invalides.",
        400,
        Object.entries(err.errors).map(([field, error]) => ({
          field,
          message: (error as mongoose.Error.ValidatorError).message,
        }))
      );
    }
    throw err;
  }
}

async function update(id: string, sort: Partial<ISort>): Promise<ISort | null> {
  console.log(`[DEBUG] Appel de SortRepo.update avec ID: ${id} et données:`, sort);
  if (!mongoose.isValidObjectId(id)) {
    throw new CustomError("L'ID fourni est invalide.", 400);
  }

  try {
    const updatedSort = await SortRepo.update(id, sort);
    if (!updatedSort) {
      throw new CustomError("Sort introuvable pour mise à jour.", 404);
    }

    return updatedSort;
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new CustomError(
        "Les données du sort sont invalides pour la mise à jour.",
        400,
        Object.entries(err.errors).map(([field, error]) => ({
          field,
          message: (error as mongoose.Error.ValidatorError).message,
        }))
      );
    }
    throw err;
  }
}

async function deleteById(id: string): Promise<ISort | null> {
  console.log(`[DEBUG] Suppression dans SortService avec l'ID : ${id}`);
  if (!mongoose.isValidObjectId(id)) {
    throw new CustomError("L'ID fourni est invalide.", 400);
  }

  const deletedSort = await SortRepo.delete(id);
  if (!deletedSort) {
    throw new CustomError("Sort introuvable pour suppression.", 404);
  }

  return deletedSort;
}

export default {
  getAll,
  getFiltered,
  getById,
  add,
  update,
  deleteById,
};
