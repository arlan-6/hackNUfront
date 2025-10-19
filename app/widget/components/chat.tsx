'use client';

import { useEffect, useRef, useState } from 'react';
import { IconCornerRightUp } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import io, { type Socket } from 'socket.io-client';
import {
  Avatar,
  Box,
  Button,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Text,
  Textarea,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Resume } from '@/data/users';
import { Vacancy } from '@/data/vacancies';

const Typing = () => (
  <Group justify={'flex-start'} align="flex-start">
    <Avatar radius="xl" size="sm">
      🤖
    </Avatar>
    <Paper
      radius="lg"
      px="sm"
      py="xs"
      style={{
        background: 'var(--mantine-color-gray-3)',
        color: 'var(--mantine-color-gray-0)',
        maxWidth: '80%',
        wordBreak: 'break-word',
        borderTopLeftRadius: 0,
      }}
    >
      <Loader type="dots" size="sm" color="gray" />
    </Paper>
  </Group>
);
const instructions =
  '  Ты — HR-ассистент: отвечай только на вопросы о вакансиях, резюме и карьере. Не обсуждай другие темы. Лимит: 400 символов. Пример: «Расскажу о требованиях к должности...», «В вашем резюме стоит указать...»';

export default function Chat({ vacancy, resume }: { vacancy: Vacancy; resume: Resume | string }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const viewportRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: 'user' | 'bot'; text: string }>
  >([
    // {
    //   id: 'b1',
    //   sender: 'bot',
    //   text: 'Analyzing your resume against the vacancy, please wait...',
    // },
  ]);
  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  // typing indicator handled via `typing` state
  const socketRef = useRef<Socket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // keep typing state controlled by send/receive events
  // Initialize client-side websocket
  useEffect(() => {
    setLastError(null);
    // Use same URL and path as page.tsx for FastAPI Socket.IO
    const ioBase = 'http://localhost:8000';
    const ioPath = '/socket.io';
    const wsFallbackUrl = 'wss://echo.websocket.events';
    let cleanup: (() => void) | undefined;
    if (ioBase) {
      const s = io(ioBase, {
        path: ioPath,
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
      });
      socketRef.current = s;
      s.on('connect', () => {
        setConnected(true);
        setLastError(null);
        setTyping(true);
        // On connect, send first vacancy and resume with text 'analyse'
        let vacancyData = vacancy;
        let resumeData = resume;
        // If resume is a string, try to parse as JSON, else send as is
        if (typeof resumeData === 'string') {
          try {
            resumeData = JSON.parse(resumeData);
          } catch {}
        }
        const toText = (data: any) => {
          if (typeof data === 'string') return data;
          try {
            return JSON.stringify(data, null, 2);
          } catch {
            return String(data);
          }
        };

        const intro =
          'Ты — AI-ассистент по подбору персонала: сразу после отклика проанализируй резюме и вакансию, определи процент совместимости; если ≥50% — выведи приветствие, краткий анализ с процентом и уточняющие вопросы (например: «Приветствую! Совместимость: ~70%. Основные расхождения: опыт 1 год вместо 3+ и удаленный формат. Готовы к обучению? Рассматриваете работу в офисе?»); если <50% — вежливо откажи с обоснованием: «Приветствую! К сожалению, совместимость низкая (30%): требуется Python-разработчик, а в вашем резюме преобладает JavaScript. Попробуйте выбрать что-то другое. Благодарю за интерес!» лимит 500 символов, ты обязан отвечать только по теме hr';

        const text = `${intro}

      Вакансия:
      ${toText(vacancyData)}

      Резюме:
      ${toText(resumeData)}
      
      
      ${instructions}
      `;

        s.emit('chat:message', { text, at: Date.now() });
        // console.log(text);
      });
      s.on('disconnect', (reason: string) => {
        setConnected(false);
        setLastError(reason || 'Disconnected');
        setTyping(false);
      });
      s.on('connect_error', (err: any) => {
        setConnected(false);
        setLastError(err?.message || 'Connection error');
        setTyping(false);
      });
      s.on('chat:message', (payload: { text: string; at?: number; from?: string }) => {
        setTyping(false);
        const items = Array.isArray(payload) ? (payload as any[]) : [payload as any];
        const texts = items
          .map((item) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              if (typeof item.text === 'string') return item.text;
              if (typeof item.data === 'string') return item.data;
            }
            return null;
          })
          .filter((t): t is string => !!t && t.trim().length > 0);

        if (!texts.length) return;

        setMessages((prev) => [
          ...prev,
          ...texts.map((t, i) => ({
            id: `io-${Date.now()}-${i}`,
            sender: 'bot' as const,
            text: t,
          })),
        ]);
      });
      s.on('message', (text: string) => {
        setTyping(false);
        setMessages((prev) => [...prev, { id: `iom-${Date.now()}`, sender: 'bot', text }]);
      });
      s.on('response', (data: { data: string }) => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `ior-${Date.now()}`, sender: 'bot', text: data.data },
        ]);
      });
      cleanup = () => {
        try {
          s.removeAllListeners();
          s.disconnect();
        } catch {}
        socketRef.current = null;
      };
    } else {
      // Fallback to public echo WebSocket for demo or custom URL via env
      const ws = new WebSocket(wsFallbackUrl);
      wsRef.current = ws;
      ws.onopen = () => {
        setConnected(true);
        setLastError(null);
      };
      ws.onclose = () => {
        setConnected(false);
        setLastError('WebSocket closed');
      };
      ws.onerror = (ev) => {
        setConnected(false);
        setLastError('WebSocket error');
      };
      ws.onmessage = (ev) => {
        const text = typeof ev.data === 'string' ? ev.data : '';
        if (!text) return;
        setTyping(false);
        setMessages((prev) => [...prev, { id: `ws-${Date.now()}`, sender: 'bot', text }]);
      };
      cleanup = () => {
        try {
          ws.close();
        } catch {}
        wsRef.current = null;
      };
    }
    return cleanup;
  }, [reconnectAttempt]);

  function handleRetry() {
    setReconnectAttempt((n) => n + 1);
  }

  // Auto-scroll to bottom when messages or typing change
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    });
    console.log(messages);
  }, [messages, typing]);

  function sendMessage() {
    const value = input.trim();
    if (!value) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: `${value}`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    setInput('');
    // Try to send over Socket.IO first
    if (socketRef.current && socketRef.current.connected) {
      try {
        socketRef.current.emit('chat:message', {
          text: `${value}   ${instructions}  ${messages.map((m) => m.text).join('\n')}`,
          at: Date.now(),
        });
      } catch {}
      return;
    }
    // Fallback to native WebSocket echo
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(value);
        setTyping(false);
      } catch {}
      return;
    }
    // If not connected, show a local bot hint
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `loc-${Date.now()}`,
          sender: 'bot' as const,
          text: 'Not connected. Message queued/dropped.',
        },
      ]);
      setTyping(false);
    }, 400);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
  return (
    <Paper
      shadow="xl"
      withBorder
      style={{
        width: 360,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Connection status bar */}
      <Group
        p="xs"
        justify="space-between"
        align="center"
        style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}
      >
        <Text size="xs" c={connected ? 'teal' : 'red'}>
          {connected ? 'Connected' : 'Disconnected'}
        </Text>
        {lastError && (
          <Group gap={4}>
            <Text
              size="xs"
              c="red"
              style={{
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {lastError}
            </Text>
            <Button size="xs" variant="light" color="red" onClick={handleRetry}>
              Retry
            </Button>
          </Group>
        )}
      </Group>

      {/* Messages */}
      <ScrollArea
        style={{ flex: 1, minHeight: 0, height: '100%' }}
        viewportRef={viewportRef}
        type="auto"
        scrollbarSize={8}
        offsetScrollbars
      >
        <Box p="md" style={{ display: 'grid', gap: 10 }}>
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              const bubbleBg = isUser
                ? colorScheme === 'dark'
                  ? theme.colors.blue[8]
                  : theme.colors.blue[6]
                : colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[1];

              const color = isUser
                ? '#fff'
                : colorScheme === 'dark'
                  ? theme.colors.gray[0]
                  : theme.black;

              // Fix: If m.text is an object, render m.text.data, else render m.text
              let displayText = m.text;
              if (
                typeof displayText === 'object' &&
                displayText !== null &&
                'data' in displayText &&
                typeof (displayText as { data?: unknown }).data === 'string'
              ) {
                displayText = (displayText as { data: string }).data;
              }

              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: isUser ? 16 : -16, y: 16 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: isUser ? 0 : 16 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                    duration: 0.32,
                    delay: isUser ? 0 : 0,
                  }}
                  style={{ width: '100%' }}
                >
                  <Group justify={isUser ? 'flex-end' : 'flex-start'} align="flex-start">
                    {!isUser && (
                      <Avatar radius="xl" size="sm">
                        🤖
                      </Avatar>
                    )}
                    <Paper
                      radius="lg"
                      px="sm"
                      py="xs"
                      style={{
                        background: bubbleBg,
                        color,
                        maxWidth: '80%',
                        wordBreak: 'break-word',
                        borderTopLeftRadius: isUser ? undefined : 0,
                        borderTopRightRadius: isUser ? 0 : undefined,
                      }}
                    >
                      {m.id === 'b1' ? (
                        <Box>
                          {/* <Skeleton height={8} width={30} radius="md" mb={6} /> */}
                          {/* <Skeleton height={8} radius="md" width="80%" /> */}
                        </Box>
                      ) : (
                        <Text size="xs" style={{ whiteSpace: 'pre-wrap' }}>
                          {displayText}
                        </Text>
                      )}
                    </Paper>
                  </Group>
                </motion.div>
              );
            })}
            {typing && <Typing />}
          </AnimatePresence>
        </Box>
      </ScrollArea>

      {/* Input area */}
      <Box
        p="sm"
        style={{
          borderTop: '1px solid var(--mantine-color-gray-3)',
          background: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        }}
      >
        <Group align="flex-end">
          <Textarea
            placeholder="Type your message..."
            autosize
            radius={'xl'}
            minRows={1}
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
            disabled={typing}
          />

          <Button radius={'xl'} onClick={sendMessage} disabled={!input.trim() || typing}>
            Send{' '}
            <motion.div
              initial={{ scale: 1, x: 0, y: 0 }}
              whileTap={{ scale: 0.9, rotate: 15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <IconCornerRightUp />
            </motion.div>
          </Button>
        </Group>
      </Box>
    </Paper>
  );
}
