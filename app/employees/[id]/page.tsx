import { notFound } from 'next/navigation';
import { Anchor, Badge, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import { listApplicationsByUser } from '@/data/applications';
import { findUserById } from '@/data/users';
import { getVacancy } from '@/data/vacancies';

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = findUserById(id);
  if (!user || user.role !== 'employee') return notFound();

  const applications = listApplicationsByUser(user.id);

  return (
    <Container py="lg">
      <Stack gap="xs">
        <Group>
          <Title order={2}>{user.name}</Title>
          <Badge variant="light" color="blue">
            Employee
          </Badge>
        </Group>
        <Text c="dimmed">{user.email}</Text>
        {user.resume && (
          <Stack gap="xs" mt="sm">
            {(user.resume.city || user.resume.position) && (
              <Text>
                {user.resume.position ? (
                  <>
                    <b>Position:</b> {user.resume.position}
                  </>
                ) : null}
                {user.resume.position && user.resume.city ? ' • ' : ''}
                {user.resume.city ? (
                  <>
                    <b>City:</b> {user.resume.city}
                  </>
                ) : null}
              </Text>
            )}
            {typeof user.resume.workExperienceYears === 'number' && (
              <Text>
                <b>Experience:</b> {user.resume.workExperienceYears} years
              </Text>
            )}
            {user.resume.summary && (
              <Text>
                <b>Summary:</b> {user.resume.summary}
              </Text>
            )}
            {user.resume.skills && user.resume.skills.length > 0 && (
              <Text>
                <b>Skills:</b> {user.resume.skills.join(', ')}
              </Text>
            )}
            {user.resume.experience && user.resume.experience.length > 0 && (
              <Stack gap={4}>
                <Text fw={600}>Experience:</Text>
                {user.resume.experience.map((exp, i) => (
                  <Text key={i} size="sm">
                    {exp.role} at {exp.company}
                    {exp.period ? ` • ${exp.period}` : ''}
                    {exp.description ? ` — ${exp.description}` : ''}
                  </Text>
                ))}
              </Stack>
            )}
            {/* Applications section outside resume */}
            {applications.length > 0 ? (
              <Stack mt="xl" gap="xs">
                <Title order={3}>My Applications</Title>
                {applications.map((app) => {
                  const vacancy = getVacancy(app.vacancyId);
                  return (
                    <Card key={app.id} withBorder radius="md" p="md">
                      <Group justify="space-between">
                        <Text fw={600}>{vacancy?.title || 'Unknown position'}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(app.createdAt).toLocaleString()}
                        </Text>
                      </Group>
                      {app.message && (
                        <Text size="sm" mt={4}>
                          <b>Message:</b> {app.message}
                        </Text>
                      )}
                      <Text size="xs" c="dimmed" mt={4}>
                        Status: {app.status}
                      </Text>
                    </Card>
                  );
                })}
              </Stack>
            ) : null}
            {user.resume.education && user.resume.education.length > 0 && (
              <Stack gap={4}>
                <Text fw={600}>Education:</Text>
                {user.resume.education.map((ed, i) => (
                  <Text key={i} size="sm">
                    {ed.school}
                    {ed.degree ? ` — ${ed.degree}` : ''}
                    {ed.period ? ` • ${ed.period}` : ''}
                  </Text>
                ))}
              </Stack>
            )}
            {user.resume.languages && user.resume.languages.length > 0 && (
              <Text>
                <b>Languages:</b> {user.resume.languages.join(', ')}
              </Text>
            )}
            {(user.resume.salaryExpectation || user.resume.employmentFormat) && (
              <Text>
                {user.resume.salaryExpectation ? (
                  <>
                    <b>Salary:</b> {user.resume.salaryExpectation}
                  </>
                ) : null}
                {user.resume.salaryExpectation && user.resume.employmentFormat ? ' • ' : ''}
                {user.resume.employmentFormat ? (
                  <>
                    <b>Format:</b> {user.resume.employmentFormat}
                  </>
                ) : null}
              </Text>
            )}
            {user.resume.links && (
              <Group gap="xs">
                {user.resume.links.github && (
                  <Anchor href={user.resume.links.github} target="_blank" rel="noreferrer noopener">
                    GitHub
                  </Anchor>
                )}
                {user.resume.links.linkedin && (
                  <Anchor
                    href={user.resume.links.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    LinkedIn
                  </Anchor>
                )}
                {user.resume.links.website && (
                  <Anchor
                    href={user.resume.links.website}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Website
                  </Anchor>
                )}
              </Group>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
