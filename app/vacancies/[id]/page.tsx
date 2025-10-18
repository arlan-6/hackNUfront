import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Alert, Anchor, Badge, Container, Group, Stack, Text, Title } from '@mantine/core';
import { getCurrentUser } from '@/app/actions/auth';
import { ApplyToVacancy } from '@/components/Vacancy/ApplyToVacancy';
import { hasAppliedToVacancy } from '@/data/applications';
import { getVacancy } from '@/data/vacancies';

type Props = { params: Promise<{ id: string }>; searchParams?: { [key: string]: string } };

export default async function VacancyDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const vacancy = getVacancy(id);
  if (!vacancy) return notFound();
  const user = await getCurrentUser();
  const canApply = !!user && user.role === 'employee';
  const alreadyApplied = user ? hasAppliedToVacancy(vacancy.id, user.id) : false;

  const resolvedSearchParams = await searchParams;
  const applied = resolvedSearchParams?.applied === '1';

  return (
    <Container py="lg">
      <Stack gap="xs">
        {applied && (
          <Alert color="green" title="Application sent!" mb="md">
            Your application was submitted successfully.
          </Alert>
        )}
        <Title order={2}>{vacancy.title}</Title>
        <Text c="dimmed">
          <Anchor href={`/employers/${vacancy.employerId}`} underline="hover">
            {vacancy.company}
          </Anchor>{' '}
          • {vacancy.location}
        </Text>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Salary:
          </Text>
          <Text size="sm" fw={600} c="green.7">
            {vacancy.salary}
          </Text>
        </Group>
        {vacancy.experience_required && (
          <Badge variant="light" color="grape" w="fit-content">
            {vacancy.experience_required}
          </Badge>
        )}
        <Group gap="xs" mt="xs">
          {vacancy.skills_required.map((s) => (
            <Badge key={s} variant="light" color="blue">
              {s}
            </Badge>
          ))}
        </Group>
        <Text mt="sm">{vacancy.description}</Text>

        <ApplyToVacancy
          vacancyId={vacancy.id}
          canApply={canApply}
          alreadyApplied={alreadyApplied}
        />
      </Stack>
    </Container>
  );
}
