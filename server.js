import mongoose from "mongoose";
import express from "express";
import bodyparser from "express";
import { Contact } from "./Models/contact.js";
import cors from 'cors'

const app = express();

app.use(bodyparser.json());
app.use(cors({
  origin:"http://localhost:5173",
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}))

mongoose
  .connect(
    "mongodb+srv://shaileshdubey92:q6RloKJhcNrcsKUv@volcanus.qeuzpun.mongodb.net/",
    {
      dbName: "MERN_PROJECT_contact_keeper",
    }
  )
  .then(() => console.log("mongodb connected..."));

// @route - '/addcontact'
//@method - 'post'

app.post("/addcontact", async (req, res) => {
  // console.log("addcontact is working");
  // console.log(req.body)

  const { name, gmail, phone, ctype } = req.body;

  let contact = await Contact.findOne({ gmail });
  let phoneNumber = await Contact.findOne({ phone });

  if (contact || phoneNumber)
    return res.json({ message: "Contact Already Exist....!" });

  contact = await Contact.create({
    name,
    gmail,
    phone,
    ctype,
  });
  res.json({ message: "Contact Saved...!" });
});

// @route - '/getcontacts'
//@method - 'get'

app.get("/getcontacts", async (req, res) => {
  // console.log("getAllcontact is working");
  const contacts = await Contact.find();
  res.json({ message: "fetched all contact", contacts });
});

// @route - '/:id'
//@methode: - put

app.put("/:id", async (req, res) => {
  // console.log(req.params.id);

  const contactId = req.params.id;

  let contact = await Contact.findById(contactId);

  if (!contact) return res.json({ message: "invalid id" });
  const { name, gmail, phone, ctype } = req.body;

  contact.name = name;
  contact.gmail = gmail;
  contact.phone = phone;
  contact.ctype = ctype;

  await contact.save();
  res.json({ contact });

});

const port = 3000;

app.listen(port, () => console.log(`server is running port ${port}`));
