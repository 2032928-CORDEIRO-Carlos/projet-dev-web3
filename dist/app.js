"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const app = (0, express_1.default)();
// Middleware pour parser les requêtes JSON
app.use(express_1.default.json());
// Utilisation des routes API
app.use('/api', index_1.default);
// Middleware global pour gérer les erreurs
app.use(errorMiddleware_1.default);
exports.default = app;
