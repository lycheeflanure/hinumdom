// src/lib/validations.ts
// Zod validation schemas

import { z } from 'zod'

export const searchSchema = z.object({
  query: z
    .string()
    .min(2, 'Please enter at least 2 characters')
    .max(200, 'Search query is too long')
    .transform((val) => val.trim()),
  year_of_death: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => !val || (val >= 1800 && val <= new Date().getFullYear()), {
      message: 'Please enter a valid year',
    }),
  section_code: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !val || val >= 1, { message: 'Invalid page' }),
})

export type SearchInput = z.infer<typeof searchSchema>

export const deceasedPersonSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'Too long'),
  middle_name: z.string().max(100, 'Too long').optional(),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Too long'),
  suffix: z.string().max(20, 'Too long').optional(),
  alternative_names: z.string().max(500, 'Too long').optional(),
  birth_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  death_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  public_visibility: z.enum(['public', 'private', 'family_only']).default('public'),
})

export type DeceasedPersonInput = z.infer<typeof deceasedPersonSchema>

export const burialRecordSchema = z.object({
  deceased_person_id: z.string().uuid('Invalid ID'),
  cemetery_id: z.string().uuid('Invalid ID'),
  burial_location_id: z.string().uuid('Invalid ID').optional(),
  burial_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  burial_type: z.enum(['interment', 'entombment', 'inurnment', 'other']).default('interment'),
  record_source: z.string().max(500, 'Too long').optional(),
})

export type BurialRecordInput = z.infer<typeof burialRecordSchema>

export const MEMORIAL_FACILITY_TYPES = [
  'columbarium',
  'crypt',
  'panteon',
  'roofed tomb',
  'family mausoleum',
  'in-ground burial plot',
  'grave',
  'niche',
  'tomb',
  'other',
] as const

export const locationSchema = z.object({
  cemetery_id: z.string().uuid('Invalid cemetery'),
  section_id: z.string().uuid().optional(),
  block: z.string().max(20).optional(),
  row_number: z.string().max(20).optional(),
  lot_number: z.string().max(30).optional(),
  grave_number: z.string().max(20).optional(),
  tile_number: z.string().max(20).optional(),
  niche_number: z.string().max(20).optional(),
  burial_structure_type: z.enum(MEMORIAL_FACILITY_TYPES).default('in-ground burial plot'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

export type LocationInput = z.infer<typeof locationSchema>

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>

export const importRowSchema = z.object({
  last_name: z.string().min(1, 'Last name is required'),
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  suffix: z.string().optional(),
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  burial_date: z.string().optional(),
  section_code: z.string().optional(),
  block: z.string().optional(),
  row_number: z.string().optional(),
  lot_number: z.string().optional(),
  grave_number: z.string().optional(),
  burial_type: z.string().optional(),
  notes: z.string().optional(),
})

export type ImportRowInput = z.infer<typeof importRowSchema>
