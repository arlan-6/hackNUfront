'use client';

import React, { useEffect, useState } from 'react';
import { Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
// Do not import notifications at the top level to avoid SSR errors
import { applyToVacancy } from '@/app/actions/applications';

type Props = {
  vacancyId: string;
  canApply: boolean;
  alreadyApplied?: boolean;
};

export function ApplyToVacancy({ vacancyId, canApply, alreadyApplied }: Props) {
  const [opened, setOpened] = useState(false);

  // Show toast if redirected with ?applied=1
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('applied') === '1') {
        import('@mantine/notifications').then(({ notifications }) => {
          notifications.show({
            color: 'green',
            title: 'Application sent!',
            message: 'Your application was submitted successfully.',
          });
        });
      }
    }
  }, []);

  if (!canApply) {
    return (
      <Text c="dimmed" size="sm">
        Log in as an employee to apply.
      </Text>
    );
  }

  if (alreadyApplied) {
    return (
      <Text c="green.7" size="sm">
        You have already applied.
      </Text>
    );
  }

  return (
    <>
      <Group mt="md">
        <Button onClick={() => setOpened(true)}>Apply for this job</Button>
      </Group>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Apply">
        <form action={applyToVacancy}>
          <input type="hidden" name="vacancyId" value={vacancyId} />
          <Stack>
            <Textarea
              name="message"
              label="Message (optional)"
              minRows={4}
              placeholder="Write a short note..."
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setOpened(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Send application</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
