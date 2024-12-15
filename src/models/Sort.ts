import mongoose, { Document, Schema } from "mongoose";

// Interface TypeScript pour définir les types
export interface ISort extends Document {
  nom: string;
  categorie: string;
  niveauDifficulte: number;
  description: string;
  dateCreation: Date;
  estInterdit: boolean;
  tags: string[];
  puissance: number;
}

// Définition du schéma Mongoose pour Sort avec validations
const SortSchema: Schema = new Schema({
  nom: {
    type: String,
    required: [true, "Le nom du sort est requis."],
    trim: true,
    minlength: [3, "Le nom doit comporter au moins 3 caractères."],
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères."],
  },
  categorie: {
    type: String,
    required: [true, "La catégorie est requise."],
    enum: {
      values: ["Curatif", "Offensif", "Défensif", "Utilitaire"],
      message: "La catégorie doit être Curatif, Offensif, Défensif ou Utilitaire.",
    },
  },
  niveauDifficulte: {
    type: Number,
    required: [true, "Le niveau de difficulté est requis."],
    min: [1, "Le niveau de difficulté doit être au moins 1."],
    max: [10, "Le niveau de difficulté ne peut pas dépasser 10."],
  },
  description: {
    type: String,
    required: [true, "La description est requise."],
    trim: true,
    minlength: [3, "La description doit comporter au moins 3 caractères."],
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  estInterdit: {
    type: Boolean,
    required: [true, "Le statut d'interdiction est requis."],
  },
  tags: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.length > 0;
      },
      message: "Il doit y avoir au moins un tag.",
    },
  },
  puissance: {
    type: Number,
    required: [true, "La puissance est requise."],
    min: [1, "La puissance doit être au moins 1."],
    max: [10, "La puissance ne peut pas dépasser 10."],
  },
});

// Création du modèle Mongoose
const Sort = mongoose.model<ISort>("Sort", SortSchema);

/**
 * Vérifier si l'objet est un Sort (validation rapide).
 *
 * @param {unknown} arg - Objet à valider
 * @returns {boolean} - `true` si c'est un sort valide
 */
function isSort(arg: unknown): arg is ISort {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "nom" in arg &&
    "categorie" in arg &&
    "niveauDifficulte" in arg &&
    "description" in arg &&
    "dateCreation" in arg &&
    "estInterdit" in arg &&
    "tags" in arg &&
    "puissance" in arg
  );
}

// Export explicite du modèle et des utilitaires
export { Sort, isSort };
