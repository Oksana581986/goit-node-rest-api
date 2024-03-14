import Contact from "../models/Contact.js";

const listContacts = (filter = {}, query ={}) => Contact.find(filter, query);

const getContactById = (id) => Contact.findById(id);

const getOneContact = filter => Contact.findOne(filter);

const addContact = (data) => Contact.create(data);

const updateContactById = (id, data) => Contact.findByIdAndUpdate(id, data);

const updateOneContact = (filter, data) => Contact.findOneAndUpdate(filter, data);

const removeContact = (id) => Contact.findByIdAndDelete(id);

const removeOneContact = (filter) => Contact.findOneAndDelete(filter);

export default {
    listContacts,
    addContact,
    getContactById,
    getOneContact,
    updateContactById,
    updateOneContact,
    removeOneContact,
    removeContact,
  };
