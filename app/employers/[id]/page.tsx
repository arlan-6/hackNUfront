import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { listApplicationsByVacancy } from '@/data/applications';
import { findUserById } from '@/data/users';
import { VACANCIES } from '@/data/vacancies';

export default async function EmployerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employer = findUserById(id);
  if (!employer || employer.role !== 'employer') return notFound();

  const posted = VACANCIES.filter((v) => v.employerId === employer.id);

  return (
    <Container py="lg">
      <Stack gap="xs">
        <Group>
          <Title order={2}>{employer.name}</Title>
          <Badge variant="light" color="grape">
            Employer
          </Badge>
          <Button
            variant="outline"
            component={Link}
            href={`/employers/${employer.id}/dashboard`}
            size="xs"
          >
            Dashboard
          </Button>
        </Group>
        <Text c="dimmed">{employer.email}</Text>
        <Title order={3} mt="md">
          Open positions
        </Title>
        {posted.length === 0 ? (
          <Text c="dimmed">No open positions yet.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {posted.map((v) => (
              <Card
                key={v.id}
                withBorder
                radius="md"
                p="md"
                component="a"
                href={`/vacancies/${v.id}`}
              >
                <Stack gap="xs">
                  <Title order={4}>{v.title}</Title>
                  <Text size="sm" c="dimmed">
                    {v.location} • {v.experience_required}
                  </Text>
                  <Group gap="xs">
                    {v.skills_required.slice(0, 4).map((s) => (
                      <Badge key={s} variant="light" color="blue">
                        {s}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Applications section */}
        <Title order={3} mt="xl">
          Applications
        </Title>
        {posted.length === 0 ? (
          <Text c="dimmed">No applications yet.</Text>
        ) : (
          <Stack gap="md">
            {posted.map((v) => {
              const apps = listApplicationsByVacancy(v.id);
              return (
                <Card key={`apps-${v.id}`} withBorder radius="md" p="md">
                  <Group justify="space-between" align="center" mb="xs">
                    <Title order={4}>{v.title}</Title>
                    <Badge variant="light" color="grape">
                      {apps.length} applications
                    </Badge>
                  </Group>
                  {apps.length === 0 ? (
                    <Text c="dimmed" size="sm">
                      No applications for this position yet.
                    </Text>
                  ) : (
                    <Stack gap={8}>
                      {apps.map((app) => {
                        const applicant = findUserById(app.userId);
                        return (
                          <Card key={app.id} withBorder radius="sm" p="sm">
                            <Group justify="space-between" align="start">
                              <Stack gap={2}>
                                <Group gap="xs">
                                  <Text fw={600}>
                                    {applicant ? (
                                      <Anchor href={`/employees/${applicant.id}`}>
                                        {applicant.name}
                                      </Anchor>
                                    ) : (
                                      'Unknown applicant'
                                    )}
                                  </Text>
                                  <Badge size="xs" variant="light" color="blue">
                                    {app.status}
                                  </Badge>
                                </Group>
                                {app.message && <Text size="sm">{app.message}</Text>}
                              </Stack>
                              <Text size="xs" c="dimmed">
                                {new Date(app.createdAt).toLocaleString()}
                              </Text>
                            </Group>
                          </Card>
                        );
                      })}
                    </Stack>
                  )}
                </Card>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
