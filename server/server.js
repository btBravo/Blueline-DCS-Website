const express = require('express');
const router = express.Router();
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// serve up production assets
app.use(express.static('client/build'));

// let the react app to handle any unknown routes
// serve up the index.html if express doesn't recognize the route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.use(cors());
app.use(express.json());
app.use('/', router);

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sales@buyblueline.net',
    pass: process.env.REACT_APP_NODEMAILER_EMAIL_PASS,
  },
});


contactEmail.verify(error => {
  error ? console.log(error) : console.log('Ready to Send');
});

router.post('/contact', (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const message = req.body.message;
  const mail = {
    from: firstname + ' ' + lastname,
    to: 'sales@buyblueline.net',
    subject: 'Contact Form Submission',
    html: `<p>Name: ${firstname} ${lastname}</p>
           <p>Email: ${email}</p>
           <p>Email: ${phoneNumber}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, error => {
    error
      ? res.json({ status: 'ERROR' })
      : res.json({ status: 'Message Sent' });
  });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});