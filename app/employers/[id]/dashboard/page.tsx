import { notFound } from 'next/navigation';
import { Badge, Button, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import { listApplicationsByVacancy } from '@/data/applications';
import { findUserById as findApplicant, findUserById } from '@/data/users';
import { VACANCIES } from '@/data/vacancies';
import Link from 'next/link';

export default async function EmployerDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employer = findUserById(id);
  if (!employer || employer.role !== 'employer') return notFound();

  const posted = VACANCIES.filter((v) => v.employerId === employer.id);

  return (
    <Container py="lg">
      <Stack gap="md">
        <Group>
        <Title order={2}>Applications Dashboard</Title>{' '}
        <Button
          variant="outline"
          component={Link}
          href={`/employers/${employer.id}/`}
          size="xs"
        >
          Back
        </Button>
        </Group>
        {posted.length === 0 ? (
          <Text c="dimmed">No open positions yet.</Text>
        ) : (
          posted.map((vacancy) => {
            const apps = listApplicationsByVacancy(vacancy.id);
            return (
              <Card key={vacancy.id} withBorder radius="md" p="md">
                <Stack gap="xs">
                  <Group>
                    <Title order={4}>{vacancy.title}</Title>
                    <Badge color="grape" variant="light">
                      {apps.length} applications
                    </Badge>
                  </Group>
                  {apps.length === 0 ? (
                    <Text c="dimmed" size="sm">
                      No applications yet.
                    </Text>
                  ) : (
                    <Stack gap={4}>
                      {apps.map((app) => {
                        const applicant = findApplicant(app.userId);
                        return (
                          <Card key={app.id} withBorder radius="sm" p="sm">
                            <Group justify="space-between">
                              <Text fw={600}>{applicant?.name || 'Unknown'}</Text>
                              <Text size="xs" c="dimmed">
                                {new Date(app.createdAt).toLocaleString()}
                              </Text>
                            </Group>
                            {app.message && (
                              <Text size="sm" mt={4}>
                                <b>Message:</b> {app.message}
                              </Text>
                            )}
                          </Card>
                        );
                      })}
                    </Stack>
                  )}
                </Stack>
              </Card>
            );
          })
        )}
      </Stack>
    </Container>
  );
}
