import functions = require("firebase-functions");
import admin = require("firebase-admin");
import nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bookhavenapp@gmail.com",
    pass: "nwiv bqlq agqe fttr",
  },
  port: 465,
  host: "smtp.gmail.com",
  secure: true,
});

exports.sendEmailNotification = functions.firestore
  .document("orders/{docID}")
  .onCreate((snap: any, ctx: any) => {
    console.log("sending email");
    console.log("email: ", snap.data().email);

    let message = "<p>Hello, " + snap.data().name +"!";
    message += "Thank you for ordering from Book Haven!</p>";
    message += "<p>Your order was successfully placed: ";
    message += "<p>" + snap.data().cart +"</p>";
    message += "<p>It will be delivered in the following week to the address: ";
    message += snap.data().address + "</p>";
    message += "<p>You will be contacted via phone: ";
    message += snap.data().phone + "</p>";
    message += "The payment of " + snap.data().price + " lei";
    message += " will be done at pickup!</p>";
    message += "<p>In case the payment details are incorrect, ";
    message += "please contact us via email!</p>";

    const mailOptions = {
      from: "bookhavenapp@gmail.com",
      to: snap.data().email,
      subject: "Order confirmation",
      html: message,
    };

    return transporter.sendMail(mailOptions, (error: any, data: any) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("email sent.");
    });
  });
