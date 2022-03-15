var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

var userSchema = new Schema({
    name: { type: String, required:true },
    email: { type:String, required:true, unique:true },
    password: { type:String, required:true },
    age: Number,
    phone: String
}, {timestamps: true})


// Generating password hash
userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) return next(err)
            this.password = hashed
            console.log('Hashed: ',this)
            return next()
        })
    } else {
        next()
    }
})


// Method for comparing passwords
userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err,result) => {
        return cb(err,result)
    })
}

var User = mongoose.model('User', userSchema)

module.exports = User