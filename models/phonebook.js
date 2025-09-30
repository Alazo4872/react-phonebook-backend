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
    number: {type: String,
      minLength:8,
      required: true,
      validate: {validator: function(v){
        return /^\d{2,3}-\d+$/.test(v)
      }, 
      message: props => `${props.value} is not a valid phone number! Format is 2-3 digits, dash, then remaining digits`
    }
    }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Phonebook", phonebookSchema)

