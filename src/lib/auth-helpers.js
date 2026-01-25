import { auth } from './auth.js';

/**
 * Get current session on server side
 */
export async function getSession() {
  return await auth();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Check if user has owner role
 */
export async function isOwner() {
  const session = await getSession();
  return session?.user?.role === 'owner';
}

/**
 * Check if user has staff role
 */
export async function isStaff() {
  const session = await getSession();
  return session?.user?.role === 'staff' || session?.user?.role === 'owner';
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Require owner role - throws error if not owner
 */
export async function requireOwner() {
  const session = await requireAuth();
  if (session.user.role !== 'owner') {
    throw new Error('Forbidden: Owner access required');
  }
  return session;
}
