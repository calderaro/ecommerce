import mongoose, {Schema} from "mongoose";
import Promise from "bluebird";

const { hashAsync, compareAsync } = Promise.promisifyAll(require("bcrypt")); 
const { sing } = Promise.promisifyAll(require("jsonwebtoken")); 

const UserSchema = Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  created: { type: Date },
});

UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  hashAsync(this.password)
  .then((hash) => {
    this.password = hash;
    next();
  })
});

UserSchema.statics.auth = function (data) {
  return this.findOne({ username: data.username })
  .select("_id password username").lean().exec()
  .then((user) => {
    if(!user) return Promise.reject(new Error("Bad Credentials"));
    return compareAsync(data.password, user.password)
    .then((isMatch) =>
      isMatch 
      ? jwt(user) 
      : Promise.reject(new Error("Bad Credentials"))
    );
  });
}

export default mongoose.model("user", UserSchema, "users");
 