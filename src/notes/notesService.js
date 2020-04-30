const NotesService = {
  getAllNotes(db) {
    return db.selece('*').from(notes)
  },

  insertNote(db, newNote) {
    return db
      .insert(newNote )
      .into('notes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(db, id) {
    return db
      .select('*')
      .from('notes')
      .where('id', id)
      .first()
  },

  deleteNote(db, id) {
    return db('notes')
      .where({ id })
      .delete()
  },

  updateNote(db, id, newNoteFeilds) {
    return db
      .from('notes')
      .where({ id })
      .update(newNoteFeilds)
  }
}

module.exports = NotesService