import mongoose, { Document, Schema} from "mongoose";
import bcrypt from 'bcryptjs';
import { ALL_Portfolio_ROLES, PortfolioRole } from "../constants/portfolioRoles";

export interface IUser extends Document{
    // core identity 
    name: string;
    email: string;
    password: string;
    contact: string;
    avatar: string;

    address?: {
        district: string;
        municipality?: string;
        ward?: string;
    };

    hasPostedProperty: boolean;
    isProfessional: boolean;
    profession: PortfolioRole[];

    isAdmim: boolean;
    isEmailVerified: boolean;
    isActive: boolean;

    refreshToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;

    createdAt: Date;
    UpdatedAt: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

// SCHEMA Definition
const userSchema = new Schema <IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength:[2, 'Name must be at least 2 characters'],
            maxLength: [80, 'Name must be at most 80 characters']
        },

        email: {
            type: String,
            required:[true, 'Email is required'],
            unique: true,     // Creates a unique index automatically
            lowercase: true,  // Always stored as lowercase
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },

        password:{
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be atleast 8 characters'],
            select: false, // automatic safety net that keeps the field hidden unless explicitly asked
        },

        contact: {
            type: String,
            trim: true,
        },

        avatar: {
            type: String,
        },

        address: {
            district: {
                type: String,
                trim: true,
            },
            municipality: {
                type: String,
                trim: true,
            },
            ward: {
                type: String,
                trim: true
            }
        },

        hasPostedProperty: {
            type: Boolean,
            default: false,
        },
        isProfessional: {
            type: Boolean,
            default: false
        },

        profession: {
            type: [String],
            enum: ALL_Portfolio_ROLES,    // Only valid role strings allowed
            default: []
        },

        isAdmim: {
            type: Boolean,
            default: false        // admins are created via admin panel
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },
        
        isActive: {
            type: Boolean,
            default: true
        },

        refreshToken: {
            type: String,
            select: false,     // Excluded from all queries by default
        },

        passwordResetToken: {
            type: String,
            select: false,
        },

        passwordResetExpires: {
            type: String,
            select: false
        }
    },
    {
        timestamps: true,     // automatically adds createdAt and updatedAt fields
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

userSchema.pre('save', async function (){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
