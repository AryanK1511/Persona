export interface User {
    name: string | null;
    email?: string | null;
    picture?: string | null;
}

export interface ExtendedUser extends User {
    id: string;
    name: string;
    friends?: { name: string; schedule: string; location: string }[];
    picture?: string | null;
}