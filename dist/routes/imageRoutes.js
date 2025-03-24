"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageController_1 = require("../controllers/imageController");
const router = (0, express_1.Router)();
router.post("/upload", imageController_1.uploadImage);
router.get("/", imageController_1.getImages); // Nueva ruta para obtener imágenes
router.put("/visibility/:id", imageController_1.updateImageVisibility);
exports.default = router;
