
import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import contactsSchemas from "../schemas/contactsSchemas.js";
import isValidId from "../middlewares/isValidid.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post("/", validateBody(contactsSchemas.createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:id", isValidId, validateBody(contactsSchemas.updateContactSchema), contactsControllers.updateContact);

contactsRouter.patch("/:id", isValidId, validateBody(contactsSchemas.updateStatusContactSchema), contactsControllers.updateStatusContact);

export default contactsRouter;
