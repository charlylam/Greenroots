import { deleteMe } from '@/lib/api';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ============================================================
// Route Next.js : suppression du compte de l'utilisateur connecté.
// 1. Appelle DELETE /api/users/me du backend (via deleteMe helper)
// 2. Supprime le cookie 'token' pour déconnecter l'utilisateur
// ============================================================

export async function DELETE() {
  try {
    await deleteMe();

    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[delete-account] error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du compte' },
      { status: 500 }
    );
  }
}
