import { Schema, model, Model, Document } from "mongoose";
import { createHmac, randomBytes } from "crypto";

// Define User interface (document shape)
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    salt: string;
    avatar?: string;
    stats: {
        gamesPlayed: number;
        averageWPM: number;
        bestWPM: number;
    };
}

// Define static methods interface
interface IUserModel extends Model<IUser> {
    matchPassword(
        username: string,
        password: string
    ): Promise<
        | { user: Omit<IUser, "password" | "salt"> }
        | { error: true; message: string }
    >;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        salt: { type: String },
        avatar: { type: String, default: "/uploads/default/defaultAvatar.png" },
        stats: {
            gamesPlayed: { type: Number, default: 0 },
            averageWPM: { type: Number, default: 0 },
            bestWPM: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre<IUser>("save", function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = randomBytes(16).toString("hex"); // ✅ hex encoding
        const hashedPassword = createHmac("sha256", salt)
            .update(this.password)
            .digest("hex");

        this.salt = salt;
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error as any);
    }
});

// Static method for password match
userSchema.statics.matchPassword = async function (
    username: string,
    password: string
) {
    const user = await this.findOne({ username });
    if (!user) return { error: true, message: "User does not exist" };

    const userProvidedHash = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (userProvidedHash === user.password) {
        const { password, salt, ...safeUser } = user.toObject();
        return { user: safeUser };
    }

    return { error: true, message: "Incorrect password" };
};

const UserModel = model<IUser, IUserModel>("User", userSchema);

export default UserModel;

