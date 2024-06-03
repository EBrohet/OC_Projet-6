const Book = require('../models/Book');
const fs = require('fs');

// route POST pour la création d'un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// route POST pour la publication des notes
exports.rateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      let userId = req.body.userId;
      let grade = req.body.rating;

      const existingRating = book.ratings.some(
        (rating) => rating.userId === userId
      );
      if (existingRating) {
        return res.status(400).json({ message: "Vous avez déjà noté ce livre!" });
      }

      const newRating = { userId, grade };
      book.ratings.push(newRating);

      // calcul de la note moyenne
      let sum = 0;
      for (let i = 0; i < book.ratings.length; i++) {
        sum += book.ratings[i].grade;
      }
      book.averageRating = sum / book.ratings.length;

      return book.save();
    })
    .then((updateBook) => {
      res.json(updateBook);
    })
    .catch((error) => res.status(400).json({ error }));
};

// route GET pour afficher les 3 livres les mieux notés
exports.bestRating = (req, res, next) => {
  Book.find()
    .then((books) => {
      // tri par ordre décroissant
      const ratedBooks = books.sort((a, b) =>
        b.averageRating - a.averageRating
      );
      const bestRatedBooks = ratedBooks.slice(0, 3);
      return bestRatedBooks;
    })
    .then((bestRatedBooks) => res.status(200).json(bestRatedBooks))
    .catch((error) => res.status(400).json({ error }));
};

// route PUT pour modifier un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non-autorisé" });
      } else {
        // suppression du fichier image modifié
        const filename = book.imageUrl.split('/images/')[1];
        req.file &&
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.error("Fichier non supprimé");
            }
          });

        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre modifié !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// route DELETE pour supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre supprimé !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// route GET pour afficher la page d'un livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// route GET pour afficher tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};