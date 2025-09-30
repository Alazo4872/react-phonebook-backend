const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
console.log('connecting to', url)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: {type: String,
      minLength: 3,
      required: true
    },
    number: String
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Phonebook", phonebookSchema)

