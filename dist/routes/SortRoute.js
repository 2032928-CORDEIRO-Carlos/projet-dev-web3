"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sortController_1 = require("../controllers/sortController");
const router = express_1.default.Router();
router.get("/", sortController_1.getSorts);
router.get("/:id", sortController_1.getSortById);
router.post("/", sortController_1.createSort);
router.put("/:id", sortController_1.updateSort);
router.delete("/:id", sortController_1.deleteSort);
exports.default = router;
