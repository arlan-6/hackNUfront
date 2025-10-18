'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge, Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import type { Vacancy } from '@/data/vacancies';

export const VacancyItem: FC<{ vacancy: Vacancy }> = ({ vacancy }) => {
  const router = useRouter();
  return (
    <Card
      withBorder
      radius="md"
      p="md"
      shadow="sm"
      style={{ cursor: 'pointer' }}
      onClick={() => router.push(`/vacancies/${vacancy.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push(`/vacancies/${vacancy.id}`);
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={4}>{vacancy.title}</Title>
            <Text size="sm" c="dimmed">
              <Link href={`/employers/${vacancy.employerId}`} onClick={(e) => e.stopPropagation()}>
                {vacancy.company}
              </Link>{' '}
              • {vacancy.location}
            </Text>
          </div>
          {vacancy.experience_required && (
            <Badge variant="light" color="grape">
              {vacancy.experience_required}
            </Badge>
          )}
        </Group>

        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Salary:
          </Text>
          <Text size="sm" fw={600} c="green.7">
            {vacancy.salary}
          </Text>
        </Group>

        {Array.isArray(vacancy.skills_required) && vacancy.skills_required.length > 0 && (
          <Group gap="xs">
            {vacancy.skills_required.map((skill) => (
              <Badge key={skill} variant="light" color="blue">
                {skill}
              </Badge>
            ))}
          </Group>
        )}

        <Divider />

        <Text size="sm">{vacancy.description}</Text>
      </Stack>
    </Card>
  );
};
