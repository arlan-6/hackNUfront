'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import io, { type Socket } from 'socket.io-client';
import {
  Avatar,
  Box,
  Button,
  Group,
  Paper,
  ScrollArea,
  Text,
  Textarea,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Resume } from '@/data/users';
import { Vacancy } from '@/data/vacancies';
import { IconCornerRightUp } from '@tabler/icons-react';
import { log } from 'node:console';

export default function Chat({ vacancy, resume }: { vacancy: Vacancy; resume: Resume | string }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const viewportRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: 'user' | 'bot'; text: string }>
  >([
    {
      id: 'b1',
      sender: 'bot',
      text: '👋 Hello! I’m Mantine Chat. How can I help you today?',
    },
  ]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize client-side websocket
  useEffect(() => {
    const ioUrl = 'http://10.3.24.25:8000/';
    if (ioUrl) {
      // Prefer Socket.IO when URL provided
      const s = io(ioUrl, { transports: ['websocket'] });
      socketRef.current = s;
      s.on('connect', () => setConnected(true));
      s.on('disconnect', () => setConnected(false));
      s.on('chat:message', (payload: { text: string; at?: number; from?: string }) => {
        setMessages((prev) => [
          ...prev,
          { id: `io-${Date.now()}`, sender: 'bot', text: payload.text },
        ]);
      });
      s.on('message', (text: string) => {
        setMessages((prev) => [...prev, { id: `iom-${Date.now()}`, sender: 'bot', text }]);
      });
      return () => {
        try {
          s.removeAllListeners();
          s.disconnect();
        } catch {}
        socketRef.current = null;
      };
    } else {
      // Fallback to public echo WebSocket for demo
      const url = 'http://10.3.24.25:8000/'
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => {setConnected(true)
        console.log('open')
      };
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
      ws.onmessage = (ev) => {
        const text = typeof ev.data === 'string' ? ev.data : '';
        if (!text) return;
        setMessages((prev) => [...prev, { id: `ws-${Date.now()}`, sender: 'bot', text }]);
      };
      return () => {
        try {
          ws.close();
        } catch {}
        wsRef.current = null;
      };
    }
  }, []);

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
  }, [messages, typing]);

  function sendMessage() {
    const value = input.trim();
    if (!value) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: value,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // Try to send over Socket.IO first
    if (socketRef.current && socketRef.current.connected) {
      try {
        socketRef.current.emit('chat:message', { text: value, at: Date.now() });
      } catch {}
      return;
    }
    // Fallback to native WebSocket echo
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(value);
      } catch {}
      return;
    }
    // If not connected, show a local bot hint
    setTyping(true);
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
      //   radius="lg"
      withBorder
      style={{
        width: 360,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
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
                      <Text size="xs" style={{ whiteSpace: 'pre-wrap' }}>
                        {m.text}
                      </Text>
                    </Paper>
                  </Group>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {typing && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, x: -16, y: 16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                // exit={{ opacity: 0, x: -16 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32,
                  duration: 0.32,
                  delay: 0.4,
                }}
                style={{ width: '100%' }}
              >
                <Group justify="flex-start">
                  <Avatar radius="xl" size="sm">
                    🤖
                  </Avatar>
                  <Paper
                    radius="lg"
                    p="sm"
                    style={{
                      background:
                        colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
                      borderTopLeftRadius: 0,
                    }}
                  >
                    <Text size="xs" c="dimmed">
                      Bot is typing…
                    </Text>
                  </Paper>
                </Group>
              </motion.div>
            )}
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
              Send <motion.div 
              initial={{ scale: 1 ,x:0,y:0}}
            whileTap={{ scale: 0.9, rotate: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            ><IconCornerRightUp /></motion.div>
            </Button>
            
        </Group>
      </Box>
    </Paper>
  );
}
