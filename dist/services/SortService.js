"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSorts = getAllSorts;
exports.getSortById = getSortById;
exports.addSort = addSort;
exports.updateSort = updateSort;
exports.deleteSort = deleteSort;
const Sort_1 = __importDefault(require("../models/Sort"));
// Récupérer tous les sortilèges
function getAllSorts() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Sort_1.default.find();
    });
}
// Récupérer un sortilège par ID
function getSortById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Sort_1.default.findById(id);
    });
}
// Ajouter un sortilège
function addSort(sortData) {
    return __awaiter(this, void 0, void 0, function* () {
        const sort = new Sort_1.default(sortData);
        return yield sort.save();
    });
}
// Mettre à jour un sortilège
function updateSort(id, sortData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Sort_1.default.findByIdAndUpdate(id, sortData, { new: true, runValidators: true });
    });
}
// Supprimer un sortilège
function deleteSort(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Sort_1.default.findByIdAndDelete(id);
    });
}
