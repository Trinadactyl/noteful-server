const express = require('express');
const xss = require('xss');

const foldersRouter = express.Router();
const FoldersService = require('./folders-service');

// middleware setup
foldersRouter.use(express.json());


// sanitizing folder data before it goes out
const sanitizeFolder = folder => {
  return {
    id: folder.id,
    name: xss(folder.name)
  };
};


// read records
foldersRouter.get('/', (req, res, next) => {
  const db = req.app.get('db');

  FoldersService.getFolders(db)
    .then(folders => {
      return res.status(200).json(folders.map(sanitizeFolder));
    })
    .catch(next);
});

foldersRouter.post('/', (req, res, next) => {
  const db = req.app.get('db');

  FoldersService.addFolder(db, req.body)
    .then(folder => {
      return res.status(201).json(folder);
    })
    .catch(next);
});

foldersRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const db = req.app.get('db');

  FoldersService.getFolderById(db, id)
    .then(folder => {
      if (folder) {
        return res.status(200).json(sanitizeFolder(folder));
      } else {
        return res.status(404).send('Folder not found');
      }
      
    })
    .catch(next);
});


module.exports = foldersRouter;