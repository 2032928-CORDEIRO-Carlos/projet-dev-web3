"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SortRoute_1 = __importDefault(require("./SortRoute"));
const apiRouter = express_1.default.Router();
apiRouter.use("/sorts", SortRoute_1.default);
exports.default = apiRouter;
