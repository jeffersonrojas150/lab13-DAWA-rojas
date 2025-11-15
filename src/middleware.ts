// src/middleware.ts (CÓDIGO FINAL Y CORREGIDO PARA VERCEL)

import { withAuth } from "next-auth/middleware";

export default withAuth(
    // `withAuth` extiende tu `Request` con el token del usuario.
    // Por ahora, no necesitamos hacer nada en esta función,
    // pero es el lugar para lógica de middleware más avanzada.
    function middleware(req) {
        // Puedes, por ejemplo, redirigir basado en el rol del usuario:
        // console.log(req.nextauth.token)
    }
);

// El matcher sigue igual, define qué rutas están protegidas
export const config = {
    matcher: ["/dashboard", "/profile"],
};