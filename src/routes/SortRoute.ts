import HttpStatusCodes from "../common/HttpStatusCodes";
import SortService from "../services/SortService";
import { ISort, isSort } from "../models/Sort";
import { IReq, IRes } from "./types/express/misc";
import CustomError from "../utils/CustomError";

// **** Functions **** //

/**
 * Méthode permettant de récupérer tous les sorts depuis la BD.
 * Si des filtres sont fournis dans la requête on applique les filtres.
 *
 * @param req - L'objet de requête Express contenant potentiellement des filtres dans `req.query`.
 * @param res - L'objet de réponse Express pour retourner les données ou les erreurs.
 * @throws CustomError - Si une erreur spécifique survient, elle est capturée et renvoyée.
 */
async function getAll(req: IReq, res: IRes): Promise<void> {
  try {
    const filters = req.query; // Extraction des filtres de la requête
    console.log("[DEBUG] Filtres reçus dans la requête GET:", filters);

    const sorts = Object.keys(filters).length
      ? await SortService.getFiltered(filters as Partial<ISort>)
      : await SortService.getAll();

    res.status(HttpStatusCodes.OK).json({ sorts });
  } catch (error: unknown) {
    console.error("[ERROR] Erreur lors de la récupération des sortilèges :", error);
    if (error instanceof CustomError) {
      res.status(error.status).json({
        message: error.message,
        errors: error.details || [],
      });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Erreur interne lors de la récupération des sortilèges.",
      });
    }
  }
}

/**
 * Méthode permettant la récupération d'un sort par son ID.
 *
 * @param req - L'objet de requête Express contenant l'ID dans `req.params.id`.
 * @param res - L'objet de réponse Express pour retourner les données ou les erreurs.
 * @throws CustomError - Si l'ID est invalide ou si le sortilège n'existe pas.
 */
async function getById(req: IReq, res: IRes): Promise<void> {
  try {
    const id = req.params.id;
    const sort = await SortService.getById(id);
    res.status(HttpStatusCodes.OK).json({ sort });
  } catch (error: unknown) {
    console.error("[ERROR] Erreur lors de la récupération du sort :", error);
    if (error instanceof CustomError) {
      res.status(error.status).json({
        message: error.message,
        errors: error.details || [],
      });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Erreur interne lors de la récupération du sort.",
      });
    }
  }
}

/**
 * Méthode permettant l'ajout d'un nouveau sort dans la BD.
 *
 * @param req - L'objet de requête Express contenant les données du sort dans `req.body.sort`.
 * @param res - L'objet de réponse Express pour retourner les données ajoutées ou les erreurs.
 * @throws CustomError - Si les données du sort ne sont pas valides.
 */
async function add(req: IReq<{ sort: ISort }>, res: IRes): Promise<void> {
  try {
    const { sort } = req.body;
    console.log("[DEBUG] Données reçues dans la requête :", req.body);

    if (!isSort(sort)) {
      throw new CustomError("Les données fournies ne sont pas valides.", 400);
    }

    const returnedSort = await SortService.add(sort);
    res.status(HttpStatusCodes.CREATED).json({ sort: returnedSort });
  } catch (error: unknown) {
    console.error("[ERROR] Erreur lors de l'ajout du sort :", error);
    if (error instanceof CustomError) {
      res.status(error.status).json({
        message: error.message,
        errors: error.details || [],
      });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Erreur interne lors de l'ajout du sort.",
      });
    }
  }
}

/**
 * Méthode permettant la MAJ d'un sort dans la BD.
 *
 * @param req - L'objet de requête Express contenant l'ID dans `req.params.id` et les données du sort dans `req.body.sort`.
 * @param res - L'objet de réponse Express pour retourner les données mises à jour ou les erreurs.
 * @throws CustomError - Si l'ID ou les données du sort sont invalides.
 */
async function update(req: IReq<{ sort: ISort }>, res: IRes): Promise<void> {
  try {
    const { id } = req.params;
    const { sort } = req.body;

    if (!id || !isSort(sort)) {
      throw new CustomError("ID ou données du sort invalides.", 400);
    }

    const updatedSort = await SortService.update(id, sort);

    res.status(HttpStatusCodes.OK).json({ sort: updatedSort });
  } catch (error: unknown) {
    console.error("[ERROR] Erreur lors de la mise à jour du sort :", error);
    if (error instanceof CustomError) {
      res.status(error.status).json({
        message: error.message,
        errors: error.details || [],
      });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Erreur interne lors de la mise à jour du sort.",
      });
    }
  }
}

/**
 * Méthode permettant la suppression d'un sort de la BD.
 *
 * @param req - L'objet de requête Express contenant l'ID dans `req.params.id`.
 * @param res - L'objet de réponse Express pour retourner une confirmation ou les erreurs.
 * @throws CustomError - Si l'ID est invalide ou si le sortilège n'existe pas.
 */
async function delete_(req: IReq, res: IRes): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError("L'ID est requis pour supprimer un sort.", 400);
    }

    const deletedSort = await SortService.deleteById(id);

    res.status(HttpStatusCodes.OK).json({
      message: "Sort supprimé avec succès.",
      sort: deletedSort,
    });
  } catch (error: unknown) {
    console.error("[ERROR] Erreur lors de la suppression du sort :", error);
    if (error instanceof CustomError) {
      res.status(error.status).json({
        message: error.message,
        errors: error.details || [],
      });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Erreur interne lors de la suppression du sort.",
      });
    }
  }
}

// **** Export default **** //
export default {
  getAll,
  getById,
  add,
  update,
  delete: delete_,
} as const;
