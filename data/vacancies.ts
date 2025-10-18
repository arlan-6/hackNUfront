import type {} from 'react';

export type Vacancy = {
  id: string;
  title: string;
  company: string;
  employerId: string; // user id of employer who posted
  location: string;
  salary: string;
  experience_required: string;
  skills_required: string[];
  description: string;
};

export const VACANCIES: Vacancy[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'HackNU',
    employerId: 'seed-employer-1',
    location: 'Astana',
    salary: '400000–600000 KZT',
    experience_required: '2+ years',
    skills_required: ['React', 'TypeScript', 'REST API'],
    description:
      'We are seeking a frontend developer to build interactive web apps using React and TypeScript.',
  },
  {
    id: '2',
    title: 'Data Analyst',
    company: 'SmartAnalytics',
    employerId: 'seed-employer-2',
    location: 'Almaty',
    salary: '350000–500000 KZT',
    experience_required: '1+ year',
    skills_required: ['Python', 'SQL', 'Pandas'],
    description: 'Analyze business data, build dashboards and insights using Python and SQL.',
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'KazTech Solutions',
    employerId: 'seed-employer-1',
    location: 'Astana',
    salary: '500000–750000 KZT',
    experience_required: '3+ years',
    skills_required: ['Node.js', 'PostgreSQL', 'REST', 'Docker'],
    description:
      'Design and implement resilient backend services with Node.js and PostgreSQL. Experience with Docker and CI/CD is a plus.',
  },
  {
    id: '4',
    title: 'Mobile Developer',
    company: 'Alatau Apps',
    employerId: 'seed-employer-2',
    location: 'Almaty',
    salary: '450000–650000 KZT',
    experience_required: '2+ years',
    skills_required: ['React Native', 'TypeScript', 'Redux'],
    description:
      'Build and maintain cross‑platform mobile applications with React Native and TypeScript. Familiarity with app store releases is required.',
  },
  {
    id: '5',
    title: 'ML Engineer',
    company: 'Steppe AI',
    employerId: 'seed-employer-2',
    location: 'Remote',
    salary: '600000–900000 KZT',
    experience_required: '3+ years',
    skills_required: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
    description:
      'Develop, train, and deploy machine learning models. Experience with experiment tracking and model serving is desired.',
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'CloudNomad',
    employerId: 'seed-employer-1',
    location: 'Shymkent',
    salary: '550000–800000 KZT',
    experience_required: '3+ years',
    skills_required: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    description:
      'Own infrastructure automation and observability across environments. Strong AWS and Kubernetes background required.',
  },
  {
    id: '7',
    title: 'UI/UX Designer',
    company: 'DesignHub',
    employerId: 'seed-employer-2',
    location: 'Astana',
    salary: '300000–500000 KZT',
    experience_required: '2+ years',
    skills_required: ['Figma', 'User Research', 'Prototyping'],
    description:
      'Create intuitive interfaces and design systems. Collaborate with product and engineering to deliver delightful experiences.',
  },
];

export function getVacancy(id: string): Vacancy | undefined {
  return VACANCIES.find((v) => v.id === id);
}
