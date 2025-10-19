import { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Button, Group, Paper, Text, Transition } from '@mantine/core';
import { getCurrentUser } from '@/app/actions/auth';
import { Resume } from '@/data/users';
import { getVacancy, Vacancy } from '@/data/vacancies';
import { WidgetContext } from '../lib/context';
import Chat from './chat';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);
  const [vacancy, setVacancy] = useState<Vacancy>();
  const [resume, setResume] = useState<string | Resume>();
  // Fetch current user on mount (client) and set resume
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        if (user && user.role === 'employee') {
          if (!user.resume) {
            setResume("User don't have resume");
          } else {
            setResume(user.resume);
          }
        }
      } catch (e) {
        // silent fail; resume stays undefined
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  // Open widget when any element with class "submit_applicaiotn" is clicked
  // Note: import useEffect from react at the top: import { useContext, useEffect } from "react";
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const vacancyId = window.location.pathname.split('/').pop() || '';

    if (!vacancyId) return;
    setVacancy(getVacancy(vacancyId));

    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target && target.closest?.('.submit_applicaiotn')) {
        setIsOpen(true);
      }
    };

    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [setIsOpen]);
  // When widget is closed
  // if (!isOpen && vacancy && resume) {
  //   return (
  //     <Transition mounted transition="pop" duration={180} timingFunction="ease-out">
  //       {(btnStyles) => (
  //         <Button
  //           onClick={() => setIsOpen(true)}
  //           radius="md"
  //           size="md"
  //           variant="filled"
  //           style={{
  //             position: 'fixed',
  //             bottom: 20,
  //             right: 20,
  //             zIndex: 9999,
  //             ...btnStyles,
  //           }}
  //         >
  //           Open Widget
  //         </Button>
  //       )}
  //     </Transition>
  //   );
  // }
    if(!isOpen) {
    return null;
  }
  // 
  if(!resume && !vacancy ) {
    return null;
  }
  // When widget is open
  return (
    <>
      {/* Semi-transparent overlay */}
      {/* <Transition mounted transition="fade" duration={150}>
        {(overlayStyles) => (
          <Box
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.12)",
              backdropFilter: "blur(2px)",
              zIndex: 9998,
              ...overlayStyles,
            }}
          />
        )}
      </Transition> */}

      {/* Chat window */}
      <Transition mounted transition="pop" duration={200} timingFunction="ease-out">
        {(styles) => (
          <Paper
            shadow="xl"
            radius="lg"
            withBorder
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 360,
              maxHeight: 'calc(100vh - 3rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transformOrigin: 'bottom right',
              zIndex: 9999,
              ...styles,
            }}
          >
            {/* Header */}
            <Group
              justify="space-between"
              p="sm"
              style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}
            >
              <Group>
                <Avatar radius="xl">🤖</Avatar>
                <Box>
                  <Text fw={600}>Assistant</Text>
                  <Text size="xs" c="dimmed">
                    Online
                  </Text>
                </Box>
              </Group>
              <Button size="xs" variant="light" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </Group>

            {/* Chat component inside widget */}
            <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {vacancy && resume && <Chat vacancy={vacancy} resume={resume} />}
            </Box>
          </Paper>
        )}
      </Transition>
    </>
  );
}
