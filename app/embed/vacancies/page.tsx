import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { VACANCIES } from '@/data/vacancies';

export const dynamic = 'force-static';

export default function VacanciesWidget() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 8 }}>
      <Stack gap={8}>
        {VACANCIES.map((v) => (
          <Card key={v.id} withBorder radius="md" p="sm">
            <Stack gap={4}>
              <Text fw={700}>{v.title}</Text>
              <Text c="dimmed" size="sm">
                {v.company} • {v.location}
              </Text>
              <Group gap={6}>
                {v.skills_required.slice(0, 3).map((s) => (
                  <Badge key={s} variant="light" color="blue" size="xs">
                    {s}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
