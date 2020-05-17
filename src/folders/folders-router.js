const express = require('express');
const xss = require('xss');
const FoldersService = require('./foldersService');
const uuid = require('uuid');

const foldersRouter = express.Router();
const jsonBodyParser = express.json()

foldersRouter.use(express.json());

const sanitizeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name)
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
  const db = req.app.get('db');

  FoldersService.getAllFolders(db)
    .then(folders => {
      return res.status(200).json(folders.map(sanitizeFolder));
    })
    .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
  const db = req.app.get('db');
  const { name } = req.body 
  const newFolder = { name }

  console.log('req.body:', req.body)  //name: Folder 1
  console.log('newFolder', newFolder) //folder_name: undefined
  for (const [key, value] of Object.entries(newFolder))
    if (value == null)
      return res.status(400).json({
        error: { Message: `Missing '${key}' in request body` }
      });

  const id = uuid.v4();
  const folder = { id, name };

  FoldersService.insertFolder(db, folder)
    .then(folder => {
      res
        .status(201)
        .json(sanitizeFolder(folder));
    })
    .catch((error) => {
      console.log('the error:', error)
      next(Error)
    });
});

foldersRouter
  .route('/:id')
  .all((req, res, next) => {
    const db = req.app.get('db')
    FoldersService.getById(db, req.params.id)
      .then(folder => {
        if (!folder) {
          return res.status(400).json({
            error: { Message: `Folder doesn't exist` }
          })
        }
        res.folder = folder
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(sanitizeFolder(res.folder))
  })
  .delete((req, res, next) => {
    const db = req.app.get('db')
    FoldersService.deleteFolder(db, req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { name } = req.body
    const folderToUpdate = { name } 
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({ error: { Message: `Request body must contain a 'name'` }
      })
    }
    const db = req.app.get('db')
    FoldersService.updateFolder(
      db,
      req.params.id,
      folderToUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

  module.exports = foldersRouter
  

module.exports = foldersRouter;