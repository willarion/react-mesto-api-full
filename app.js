const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '5fdbc2ba44407906a0750fdf'
  };

  next();
});


app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден"});
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

