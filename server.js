const express = require('express');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const jwtcheck = expressjwt({
  secret: 'mysuperhardsecret'
});
const users = [
  { id: 1, name: 'admin', password: 'admin' },
  { id: 2, name: 'admin1', password: 'admin1' }
];

app.get('/status', (req, res) => {
  res.status(200).send('server is up');
});

app.get('/resource', (req, res) => {
  res.status(200).send('public resource');
});

app.get('/resource/private', jwtcheck, (req, res) => {
  res.status(200).send('you should be logged in to see this ');
});

app.post('/login', (req, res) => {
  if (!req.body.name || !req.body.password) {
    res.status(400).send('you need credentials');
    return;
  }

  const user = users.find(u => {
    return u.name === req.body.name && u.password === req.body.password;
  });

  if (!user) {
    res.status(401).send(`unauthorised access`);
    return;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name
    },
    'mysuperhardsecret',
    { expiresIn: '3 hours' }
  );

  res.status(200).send({
    accesstoken: token
  });
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
