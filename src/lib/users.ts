
export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    hashedPassword?: string | null;
};

export const users: User[] = [];