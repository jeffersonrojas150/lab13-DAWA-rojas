
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { users } from '@/lib/users';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return new NextResponse('Missing name, email, or password', { status: 400 });
        }

        const exist = users.find((user) => user.email === email);
        if (exist) {
            return new NextResponse('User already exists', { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            id: (users.length + 1).toString(),
            name,
            email,
            hashedPassword,
        };

        users.push(newUser);

        console.log('Usuario registrado:', newUser);
        console.log('Todos los usuarios:', users);

        return NextResponse.json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        console.error('REGISTRATION_ERROR', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}