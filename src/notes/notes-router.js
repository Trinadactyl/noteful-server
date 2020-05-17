const express = require('express');
const xss = require('xss');
const uuid = require('uuid');
const NotesService = require('./notesService');

const notesRouter = express.Router();
jsonBodyParser = express.json();

const sanitizeNote = note => ({
    id: note.id,
    name: xss(note.name),
    content: xss(note.content),
    folder_id: note.folder_id,
    modified: note.modified
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db')
    NotesService.getAllNotes(db)
      .then(notes => {
        res.json(notes.map(sanitizeNote))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const db = req.app.get('db') 
    const { name, content, folder_id } = req.body
    const newNote = { name, content, folder_id }
    

    for (const [key, value] of Object.entries(newNote))
      if (value === null)
      return res.status(400).json({
        error: { Message: `Missing '${key}' in request body` }
      })

      console.log('newNote:', newNote)

        const id = uuid.v4();
        const note = { id, name, content, folder_id };
    
    NotesService.insertNote(db, note)
      .then(note => {
        return res
          .status(201)
          .json(sanitizeNote(note))
      })
      .catch((error) => {
        console.log(error)
        next(error)
      })
  })

  notesRouter
    .route('/:id')
    .all((req, res, next) => {
      const db = req.app.get('db')
      NotesService.getById(db, req.params.id)
        then(note => {
          if (!note) {
            return res.status(404).json({
              error: { message: `Note doesn't exist` }
            })
          }
          res.note = note
        })
        .catch(next)
    })
    .get((res, req, next) => {
      res.json(sanitizeNote(note))
    })
    .delete((req, res, next) => {
      const db = req.app.get('db')
      NotesService.deleteNote(db, req.params.id)
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
      const { name } = req.body
      const noteToUpdate = { name }

      const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({ 
          error: { Message: `Request body must contain a 'name'` }
        })
      }
      const db = req.app.get('db')
      NotesService.updateNote(
        db,
        req.params.id,
        noteToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })



module.exports = notesRouter;