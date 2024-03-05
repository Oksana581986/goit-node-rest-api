
import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import contactsSchemas from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/", validateBody(contactsSchemas.createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:id", validateBody(contactsSchemas.updateContactSchema), contactsControllers.updateContact);

export default contactsRouter;
