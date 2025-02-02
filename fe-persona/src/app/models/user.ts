export interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export interface ExtendedUser extends User {
    id?: string;
}
