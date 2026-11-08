import { Usuario } from '../shared/models';

export const AUTH_STORAGE_KEY = 'usuarioLogado';
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

interface StoredSession {
  usuario: Usuario;
  expiraEm: number;
}

export function readAuthenticatedUser(): Usuario | null {
  const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!savedSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(savedSession) as Partial<StoredSession> & Usuario;

    if (parsed.usuario && typeof parsed.expiraEm === 'number') {
      if (parsed.expiraEm <= Date.now()) {
        clearAuthenticatedUser();
        return null;
      }

      return parsed.usuario;
    }

    const usuario = parsed as Usuario;
    storeAuthenticatedUser(usuario);
    return usuario;
  } catch {
    clearAuthenticatedUser();
    return null;
  }
}

export function storeAuthenticatedUser(usuario: Usuario): void {
  const session: StoredSession = {
    usuario,
    expiraEm: Date.now() + SESSION_DURATION_MS
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthenticatedUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
