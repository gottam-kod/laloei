export type User = {
    id: string;
    username: string;
    email: string;
    password: string; // Assuming password is stored in plain text for simplicity
    firstName: string;
    lastName: string;
    role: string; // e.g., 'admin', 'user'
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    profilePicture?: string; // Optional field for user profile picture URL
    lastLogin?: Date; // Optional field for the last login date
};