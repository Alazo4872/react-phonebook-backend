const mongoose = require ("mongoose")

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://lazoal4872_db_user:${password}@cluster0.8malxso.mongodb.net/phonebookDB?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name : String,
    number: String
})
const Phonebook = mongoose.model("phonebook", phonebookSchema)


if(process.argv.length == 5){
const phonebook = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
})
phonebook.save().then(result =>{
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})
}

if (process.argv.length == 3) {
    console.log("phonebook: ")
    Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
        console.log(`${phonebook.name} ${phonebook.number}`)
    })
    mongoose.connection.close()
})
}

