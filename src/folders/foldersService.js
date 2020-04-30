const FoldersService = {
  getAllFolders(db) {
    return db
      .select('*')
      .from('folders')
  },

  insertFolder(db, newFolder) {
    return db
      .insert(newFolder) 
      .into('folders')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(db, id) {
    return db
      .select('*')
      .from('folders')
      .where('id', id)
      .first()
  },
  
  deleteFolder(db, id) {
    return db
      .where({ id })
      .delete()
  },

  updateFolder(db, id, newFolderFeilds) {
    return db
      .from('folders')
      .where({ id })
      .update(newFolderFeilds)
  }
}

module.exports = FoldersService