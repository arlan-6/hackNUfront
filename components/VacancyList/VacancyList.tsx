'use client';
import React, { FC, useMemo, useState } from 'react';
import { Container, Grid, Group, Input, Text, Title } from '@mantine/core';
import { VACANCIES } from '@/data/vacancies';
import { VacancyItem } from './VacancyItem';

export const VacancyList: FC = ({}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VACANCIES;
    return VACANCIES.filter((v) =>
      [
        v.title,
        v.company,
        v.location,
        v.salary,
        v.experience_required,
        ...v.skills_required,
        v.description,
      ]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Job Vacancies</Title>
        <Input
          placeholder="Search title, company, skill..."
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          w={320}
        />
      </Group>

      {filtered.length === 0 ? (
        <Text c="dimmed">No vacancies match your search.</Text>
      ) : (
        <Grid gutter="md">
          {filtered.map((vacancy) => (
            <Grid.Col key={vacancy.id} span={{ base: 12, sm: 6 }}>
              <VacancyItem vacancy={vacancy} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
};
