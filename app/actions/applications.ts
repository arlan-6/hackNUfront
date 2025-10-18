'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import { createApplication, hasAppliedToVacancy } from '@/data/applications';
import { getVacancy } from '@/data/vacancies';

export async function applyToVacancy(formData: FormData) {
  const vacancyId = String(formData.get('vacancyId') || '');
  const message = String(formData.get('message') || '').trim();
  if (!vacancyId) throw new Error('Missing vacancy id');
  const vacancy = getVacancy(vacancyId);
  if (!vacancy) throw new Error('Vacancy not found');

  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  if (user.role !== 'employee') throw new Error('Only employees can apply');

  if (hasAppliedToVacancy(vacancyId, user.id)) {
    redirect(`/vacancies/${vacancyId}?applied=1`);
  }

  createApplication({ vacancyId, userId: user.id, message });
  redirect(`/vacancies/${vacancyId}?applied=1`);
}
