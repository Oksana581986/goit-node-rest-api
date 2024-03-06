import Contact from "../models/Contact.js";

export const getAllContacts = () => Contact.find({});

export const getContactById = id => Contact.findById(id);

export const addContact = data => Contact.create(data);

export const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data);

export const deleteContact = id => Contact.findByIdAndDelete(id);

export const updateStatusContact = id => Contact.findByIdAndUpdate(id);

