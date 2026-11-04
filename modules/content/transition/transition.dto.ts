import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const transition_content_QuerySchema = createModuleQuerySchema({

});

export type TransitionContentQueryDto = z.infer<typeof transition_content_QuerySchema>;
export type TransitionContentPayloadDto = Record<string, unknown>;
