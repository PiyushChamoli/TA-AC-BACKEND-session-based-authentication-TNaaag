var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

var userSchema = new Schema({
    name: { type:String, required:true, },
    email: { type:String, required:true, unique:true },
    password: { type:String, required:true, minlength:5 }
}, { timestamps: true })

userSchema.pre('save', function(next) {
    if (this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err,hash) => {
            if(err) return next(err)
            this.password = hash
            next()
        })
    } else {
        next()
    }
})

userSchema.methods.verifyPassword = function(password,cb) {
    bcrypt.compare(password, this.password, (err,result) => {
        if (err) return next(err)
        return cb(err,result)
    })
}

module.exports = mongoose.model('User', userSchema)