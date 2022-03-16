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

// password hash
userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err,hash) => {
            if(err) return next(err)
            this.password = hash
            return next()
        })
    } else {
        return next()
    }
})

// password match
userSchema.methods.verifyPassword = function(passsword,cb) {
    bcrypt.compare(passsword, this.passsword, (err,result) => {
        if(err) return next(err)
        return cb(err,result)
    })
}

var User = mongoose.model('User', userSchema)

module.exports = User