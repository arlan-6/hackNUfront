export type Role = 'employer' | 'employee';

export type Resume = {
  city?: string;
  position?: string;
  workExperienceYears?: number; // total years of experience
  summary?: string;
  skills?: string[];
  experience?: Array<{
    company: string;
    role: string;
    period?: string;
    description?: string;
  }>;
  education?: Array<{
    school: string;
    degree?: string;
    period?: string;
  }>;
  languages?: string[];
  salaryExpectation?: string; // e.g., "500000–700000 KZT" or "$3k/mo"
  employmentFormat?: string; // e.g., "Remote", "Hybrid", "Onsite", "Full-time"
  links?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // plain text for demo only
  role: Role;
  createdAt: number;
  resume?: Resume; // required for employees
};

// Demo-only in-memory users (passwords are plain text for simplicity).
// You can log in with these accounts on /login.
let USERS: User[] = [
  {
    id: 'seed-employer-1',
    name: 'Aigul HR',
    email: 'aigul.hr@kaztech.kz',
    password: 'a',
    role: 'employer',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
  },
  {
    id: 'seed-employer-2',
    name: 'SmartAnalytics HR',
    email: 'hr@smartanalytics.kz',
    password: 'welcome1',
    role: 'employer',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
  {
    id: 'seed-employee-1',
    name: 'Aruzhan Bek',
    email: 'aruzhan@example.com',
    password: 'pass1234',
    role: 'employee',
    resume: {
      city: 'Astana',
      position: 'Frontend Developer',
      workExperienceYears: 2,
      summary: 'Frontend developer with focus on React and TypeScript, building accessible UIs.',
      skills: ['React', 'TypeScript', 'REST', 'CSS', 'Jest'],
      experience: [
        {
          company: 'Astana Web',
          role: 'Frontend Developer',
          period: '2023–Present',
          description: 'Built internal dashboards and client portals using React and Mantine.',
        },
      ],
      education: [{ school: 'NU', degree: 'BSc Computer Science', period: '2019–2023' }],
      languages: ['Kazakh', 'Russian', 'English'],
      salaryExpectation: '500000–650000 KZT',
      employmentFormat: 'Hybrid',
      links: { github: 'https://github.com/aruzhan', linkedin: 'https://linkedin.com/in/aruzhan' },
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
  {
    id: 'seed-employee-2',
    name: 'Dias Askar',
    email: 'dias@example.com',
    password: 'pass1234',
    role: 'employee',
    resume: {
      city: 'Almaty',
      position: 'Data Analyst',
      workExperienceYears: 2,
      summary: 'Data analyst skilled in SQL and Python with interest in ML.',
      skills: ['Python', 'SQL', 'Pandas', 'Tableau'],
      experience: [
        {
          company: 'AnalyticsCo',
          role: 'Data Analyst',
          period: '2022–Present',
          description: 'Built automated reports and pipelines for business stakeholders.',
        },
      ],
      education: [{ school: 'KBTU', degree: 'BSc Information Systems', period: '2018–2022' }],
      languages: ['Kazakh', 'Russian', 'English'],
      salaryExpectation: '400000–600000 KZT',
      employmentFormat: 'Onsite/Hybrid',
      links: { linkedin: 'https://linkedin.com/in/dias' },
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: 'seed-employee-3',
    name: 'Timur N.',
    email: 'arlanhan1997@gmail.com',
    password: 'a',
    role: 'employee',
    resume: {
      city: 'Astana',
      position: 'Junior Full‑stack Developer',
      workExperienceYears: 0.5,
      summary: 'Junior software engineer exploring full‑stack development.',
      skills: ['JavaScript', 'Node.js', 'React'],
      experience: [],
      education: [],
      languages: ['Kazakh', 'Russian'],
      salaryExpectation: '250000–350000 KZT',
      employmentFormat: 'Remote/Hybrid',
      links: { github: 'https://github.com/timur' },
    },
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  },
];

export function allUsers() {
  return USERS;
}

export function findUserByEmail(email: string) {
  return USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string) {
  return USERS.find((u) => u.id === id);
}

export function createUser(input: Omit<User, 'id' | 'createdAt'>): User {
  const exists = findUserByEmail(input.email);
  if (exists) throw new Error('User already exists');
  const user: User = {
    ...input,
    id: (Date.now() + Math.random()).toString(36),
    createdAt: Date.now(),
  };
  USERS.push(user);
  return user;
}
