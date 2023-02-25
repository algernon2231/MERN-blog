import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
    username: { type: String, required: true, min: 4, unique: true },
    email: { type: String, required: true, min: 6, unique: true },
    password: { type: String, required: true, min: 6 }
})
UserSchema.pre('save', async function () {
    const user = this;
    if (!user.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
});


UserSchema.methods = {
    toJSON() {
        const obj = this.toObject();
        delete obj.password;
        return obj;
    },
    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    },
    createToken() {
        return jwt.sign({ username: this.username, _id: this._id, email: this.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    },
    refreshToken() {
        return jwt.sign({ username: this.username, _id: this._id, email: this.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15m' })
    }
}
const User = model('User', UserSchema);
export default User;
