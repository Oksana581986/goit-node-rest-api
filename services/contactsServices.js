import Contact from "../models/Contact.js";

const listContacts = () => Contact.find();

const getContactById = (id) => Contact.findById(id);

const addContact = (data) => Contact.create(data);

const updateContactById = (id, data) => Contact.findByIdAndUpdate(id, data);

const removeContact = (id) => Contact.findByIdAndDelete(id);

export default {
    listContacts,
    addContact,
    getContactById,
    updateContactById,
    removeContact,
  };
