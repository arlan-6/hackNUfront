'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession, deleteSession, getSession } from '@/data/sessions';
import { createUser, findUserByEmail, findUserById, type Resume, type Role } from '@/data/users';

const SESSION_COOKIE = 'session';

export async function signup(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'employee') as Role;
  const resumeRaw = String(formData.get('resume') || '').trim();

  if (!name || !email || !password || (role !== 'employer' && role !== 'employee')) {
    throw new Error('Invalid form data');
  }

  if (role === 'employee' && !resumeRaw) {
    throw new Error('Resume is required for employees');
  }

  let resume: Resume | undefined = undefined;
  if (role === 'employee') {
    try {
      resume = JSON.parse(resumeRaw);
    } catch (e) {
      throw new Error('Resume must be a valid JSON object');
    }
  }

  const user = createUser({
    name,
    email,
    password,
    role,
    ...(role === 'employee' ? { resume } : {}),
  });
  const session = createSession(user.id);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session.token, { httpOnly: true, path: '/', sameSite: 'lax' });
  redirect('/');
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const session = createSession(user.id);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session.token, { httpOnly: true, path: '/', sameSite: 'lax' });
  redirect('/');
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  deleteSession(token);
  jar.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', expires: new Date(0) });
  redirect('/');
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const session = getSession(token);
  if (!session) return undefined;
  return findUserById(session.userId);
}
