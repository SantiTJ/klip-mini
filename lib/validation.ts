// File: /lib/validation.ts
import { z } from 'zod';

export const ProyectoSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede superar 1000 caracteres'),
  archivo: z
    .any()
    .optional()
    .refine((file) => !file || file.size <= 5_000_000, 'Máximo 5MB') // 5MB
    .refine((file) => !file || ['image/png', 'image/jpeg', 'application/pdf'].includes(file.type),
      'Formato no válido (PNG, JPG o PDF)'),
});
export type ProyectoForm = z.infer<typeof ProyectoSchema>;
