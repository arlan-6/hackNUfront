'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  PasswordInput,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { signup } from '@/app/actions/auth';
import { allUsers } from '@/data/users';

export default function SignupPage() {
  const [role, setRole] = useState<'employee' | 'employer'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isEmployee = role === 'employee';
  const demoUsers = allUsers();
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Card withBorder p="lg" radius="md" style={{ width: 480, maxWidth: '100%' }}>
        <Stack>
          <Title order={3}>Create account</Title>
          <form action={signup}>
            <Stack>
              <TextInput name="name" label="Full name" placeholder="Jane Doe" required />
              <TextInput
                name="email"
                label="Email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <PasswordInput
                name="password"
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <Radio.Group
                name="role"
                label="I am"
                defaultValue="employee"
                required
                onChange={(v) => setRole(v as any)}
              >
                <Group>
                  <Radio value="employee" label="Employee" />
                  <Radio value="employer" label="Employer" />
                </Group>
              </Radio.Group>
              {isEmployee && (
                <Stack>
                  <Textarea
                    name="resume"
                    label="Resume (JSON)"
                    minRows={6}
                    required
                    defaultValue={JSON.stringify(
                      {
                        summary: 'Your short summary here',
                        skills: ['React', 'TypeScript'],
                        experience: [{ company: 'Company', role: 'Role', period: '2024–2025' }],
                      },
                      null,
                      2
                    )}
                  />
                  <Text size="xs" c="dimmed">
                    Tip: You can include fields like summary, skills, experience, education, and
                    links.
                  </Text>
                </Stack>
              )}
              <Button type="submit">Sign up</Button>
              <Group justify="space-between">
                <span />
                <Button component={Link} href="/login" variant="subtle" size="sm">
                  Already have an account? Login
                </Button>
              </Group>
            </Stack>
          </form>

          <Divider my="xs" />
          <Title order={5}>Demo accounts</Title>
          <Stack gap={6}>
            {demoUsers.map((u) => (
              <Card key={u.id} withBorder radius="sm" p="xs">
                <Group justify="space-between" align="center">
                  <Stack gap={2}>
                    <Group gap="xs">
                      <Badge
                        size="xs"
                        variant="light"
                        color={u.role === 'employer' ? 'grape' : 'blue'}
                      >
                        {u.role}
                      </Badge>
                      <Text size="sm" fw={600}>
                        {u.name}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Email: {u.email} • Password: {u.password}
                    </Text>
                  </Stack>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => {
                      setEmail(u.email);
                      setPassword(u.password);
                      setRole(u.role);
                    }}
                  >
                    Fill
                  </Button>
                </Group>
              </Card>
            ))}
            <Text size="xs" c="dimmed">
              Demo only. Do not use real credentials.
            </Text>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}
