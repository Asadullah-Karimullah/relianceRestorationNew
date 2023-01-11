
const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/keys.env" });
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(express.static(path.join(__dirname, "/public")));

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/contact-us", function (req, res) {
  let result = {};
  let validate = true;

  const { name, subject, email, message } = req.body;

  if (typeof name != "string" || name.length === 0) {
    result.name = "Please specify a name";
    validate = false;
  } else if (name.length < 3) {
    result.name = "Name should be at least 3 letters";
    validate = false;
  }


  let emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]+)*$/;
  if (typeof email !== "string" || email.length === 0) {
    result.email = "You must enter an Email!";
    validate = false;
  } else if (!email.match(emailPattern)) {
    result.email = "Please enter a valid Email!";
    validate = false;
  }

  if (message.length === 0) {
    result.message = "Notes cannot be empty";
    validate = false;
  } else if (message.length < 5) {
    result.message = "Notes cannot be less than 5 characters!";
    validate = false;
  }

  if (validate) {
    // const db = mysql.createConnection({
    //   host: "us-cdbr-east-06.cleardb.net",
    //   user: "b7ec52bd22d47f",
    //   password: "e2c10bad",
    //   database: "heroku_4a49882ad16bd28",
    // });

    // db.connect((err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log("connected successfull!");
    // });
    // let sql =
    //   "INSERT INTO CONTACTS (name, phone, email, date, fromAdd, toAdd,message) values(?,?,?,?,?,?,?)";
    // db.query(
    //   sql,
    //   [name, phone, email, date, from, to, message],
    //   (err, result) => {
    //     if (err) console.log(err);
    //     console.log("1 record added");
    //   }
    // );

    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      cc: "yourexpertmover@yahoo.com",
      // bcc: 'Assadullah_afaq@yahoo.com',
      from: {
        email: "asad.afaq97@gmail.com",
        name: "Expert Movers",
      },
      subject: subject + "Contact Us Form Submission",
      html: `Hello ${name}, <br>
                Thanks for reaching us out today.
                An Expert Movers' representative will be with you shortly. At the mean time you can check the following info that you have entered, if there is anything you want to change you can email us at: <br>
                yourexpertmover@yahoo.com
                <br>
                Or you can call us directly at: <br>
                6477236820
                <br>
                <br>
                Name:            ${name}
                <br>
                Email:           ${email}
                <br>
                Notes:             ${message}
                <br>
                <br>
                if you'd like to know more about Expert Movers you can visit our website at: <br>
                https://www.yourexpertmover.com/
                `,
    };

    sgMail
      .send(msg)
      .then(() => {
        res.send(result);
      })
      .catch((err) => {
        console.log(`Error ${err}`);
        res.send(result);
      });
  } else {
    res.send(result);
  }
});

app.use(function (req, res) {
  res.status(404).send("Page Not Found!");
});

const HTTP_PORT = process.env.PORT;

function onHttpStart() {
  console.log("Express http server listening on : " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);
