import 'server-only';

import fs from 'fs';
import path from 'path';

export type Application = {
  id: string;
  vacancyId: string;
  userId: string;
  message?: string;
  status: 'submitted';
  createdAt: number;
};

// Default seed so Aigul HR sees applications from Timur
const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 'seed-app-1',
    vacancyId: '1',
    userId: 'seed-employee-3',
    message:
      'Hi Aigul, I am interested in the Frontend role. I have React and JS experience. Thanks!',
    status: 'submitted',
    createdAt: Date.now() - 1000 * 60 * 20,
  },
  {
    id: 'seed-app-2',
    vacancyId: '3',
    userId: 'seed-employee-3',
    message: 'Hello! I am a junior full-stack dev and would love to join as Backend Engineer.',
    status: 'submitted',
    createdAt: Date.now() - 1000 * 60 * 10,
  },
];

export function listApplicationsByVacancy(vacancyId: string) {
  const apps = readApplications();
  return apps.filter((a) => a.vacancyId === vacancyId);
}

export function listApplicationsByUser(userId: string) {
  const apps = readApplications();
  return apps.filter((a) => a.userId === userId);
}

export function findApplicationByVacancyAndUser(vacancyId: string, userId: string) {
  const apps = readApplications();
  return apps.find((a) => a.vacancyId === vacancyId && a.userId === userId);
}

export function hasAppliedToVacancy(vacancyId: string, userId: string) {
  return !!findApplicationByVacancyAndUser(vacancyId, userId);
}

export function createApplication(input: {
  vacancyId: string;
  userId: string;
  message?: string;
}): Application {
  const apps = readApplications();
  const exists = apps.find((a) => a.vacancyId === input.vacancyId && a.userId === input.userId);
  if (exists) return exists;
  const app: Application = {
    id: (Date.now() + Math.random()).toString(36),
    vacancyId: input.vacancyId,
    userId: input.userId,
    message: input.message,
    status: 'submitted',
    createdAt: Date.now(),
  };
  apps.push(app);
  writeApplications(apps);
  return app;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_PATH = path.join(DATA_DIR, 'applications.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

function readApplications(): Application[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Application[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If file doesn't exist yet, seed with defaults
    ensureDataDir();
    try {
      fs.writeFileSync(DATA_PATH, JSON.stringify(DEFAULT_APPLICATIONS, null, 2), 'utf-8');
    } catch {
      // ignore write errors
    }
    return DEFAULT_APPLICATIONS;
  }
}

function writeApplications(apps: Application[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_PATH, JSON.stringify(apps, null, 2), 'utf-8');
}
