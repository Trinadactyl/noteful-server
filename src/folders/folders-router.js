const express = require('express');
const xss = require('xss');
const FoldersService = require('./folders-service');
//const uuid = require('uuid');

const foldersRouter = express.Router();
const jsonBodyParser = express.json()

//foldersRouter.use(express.json());

// sanitizing folder data before it goes out
const sanitizeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name)
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
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