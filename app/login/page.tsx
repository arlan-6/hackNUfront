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
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { login } from '@/app/actions/auth';
import { allUsers } from '@/data/users';

export default function LoginPage() {
  const demoUsers = allUsers();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Card withBorder p="lg" radius="md" style={{ width: 420, maxWidth: '100%' }}>
        <Stack>
          <Title order={3}>Login</Title>
          <form action={login}>
            <Stack>
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
              <Button type="submit">Login</Button>
              <Group justify="space-between">
                <span />
                <Button component={Link} href="/signup" variant="subtle" size="sm">
                  Create an account
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
