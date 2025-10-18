'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Flex, Group, Text } from '@mantine/core';
import { logout } from '@/app/actions/auth';

type ClientUser = { id: string; name: string; role: 'employer' | 'employee' } | null;

export const Header = () => {
  const [user, setUser] = useState<ClientUser>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted) return;
        setUser(data?.user ?? null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Flex justify={'space-between'} px={'md'} py={'sm'} align={'center'}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Text fw={700} size="lg">
          Demo myLink
        </Text>
      </Link>
      {user ? (
        <Group>
          <Badge variant="light" color="grape">
            {user.role}
          </Badge>
          <Text size="sm">Hi, {user.name}</Text>
          <Button
            component={Link}
            href={user.role === 'employer' ? `/employers/${user.id}` : `/employees/${user.id}`}
            variant="light"
          >
            Profile
          </Button>
          <form action={logout}>
            <Button type="submit" variant="light" color="red">
              Logout
            </Button>
          </form>
        </Group>
      ) : (
        <Group>
          <Button component={Link} href="/login" variant="light">
            Login
          </Button>
          <Button component={Link} href="/signup">
            Sign up
          </Button>
        </Group>
      )}
    </Flex>
  );
};
