import fs from "fs/promises";
import path from "path";
import nanoid from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

export const getContactById = async (contactId) => {
  const listOfContacts = await listContacts();
  const needContact = listOfContacts.find(
    (contact) => contact.id === contactId
  );
  return needContact || null;
};

export const addContact = async (name, email, phone) => {
  const listOfContacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  listOfContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(listOfContacts, null, 2));
  return newContact;
};

export const removeContact = async (contactId) => {
  const listOfContacts = await listContacts();
  const deletedContactIndex = listOfContacts.findIndex(
    (contact) => contact.id === contactId);
  if (deletedContactIndex !== -1) {
    const [deletedContact] = listOfContacts.splice(deletedContactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(listOfContacts, null, 2));
    return deletedContact;
  }
  return null;
};