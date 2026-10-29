import { z } from 'zod';

export const EventTypeSchema = z.enum(['NEW_SUBSCRIBER', 'NEW_MEMBER', 'LIVE_CHAT_MESSAGE']);
export type EventType = z.infer<typeof EventTypeSchema>;
