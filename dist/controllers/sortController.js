"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSort = exports.updateSort = exports.createSort = exports.getSortById = exports.getSorts = void 0;
const SortService = __importStar(require("../services/SortService"));
// Récupérer tous les sortilèges
const getSorts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sorts = yield SortService.getAllSorts();
        res.json(sorts);
    }
    catch (error) {
        next(error);
    }
});
exports.getSorts = getSorts;
// Récupérer un sortilège par ID
const getSortById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sort = yield SortService.getSortById(req.params.id);
        if (!sort) {
            return res.status(404).json({ message: "Sortilège non trouvé" });
        }
        res.json(sort);
    }
    catch (error) {
        next(error);
    }
});
exports.getSortById = getSortById;
// Ajouter un sortilège
const createSort = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sort = yield SortService.addSort(req.body);
        res.status(201).json(sort);
    }
    catch (error) {
        next(error);
    }
});
exports.createSort = createSort;
// Mettre à jour un sortilège
const updateSort = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSort = yield SortService.updateSort(req.params.id, req.body);
        if (!updatedSort) {
            return res.status(404).json({ message: "Sortilège non trouvé" });
        }
        res.json(updatedSort);
    }
    catch (error) {
        next(error);
    }
});
exports.updateSort = updateSort;
// Supprimer un sortilège
const deleteSort = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSort = yield SortService.deleteSort(req.params.id);
        if (!deletedSort) {
            return res.status(404).json({ message: "Sortilège non trouvé" });
        }
        res.status(200).json({ message: "Sortilège supprimé avec succès" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSort = deleteSort;
