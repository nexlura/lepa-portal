/**
 * Sierra Leone education levels & grades — TypeScript data file for Next.js
 *
 * Location: /data/sierraleone-grades.ts
 */

export interface YearLevel {
  id: string;
  name: string;
}

export interface EducationLevel {
  id: string;
  name: string;
  short: string;
  years: YearLevel[];
  notes?: string;
}

export const SIERRA_LEONE_EDUCATION_LEVELS: EducationLevel[] = [
  {
    id: 'pre-primary',
    name: 'Pre-Primary / Early Childhood Education',
    short: 'Pre-Primary',
    years: [
      { id: 'nursery', name: 'Nursery' },
      { id: 'kg1', name: 'KG 1' },
      { id: 'kg2', name: 'KG 2' },
    ],
    notes: 'Typically 1–3 years depending on school; ages ~3–5.',
  },
  {
    id: 'primary',
    name: 'Primary School',
    short: 'Primary',
    years: [
      { id: 'class-1', name: 'Class 1' },
      { id: 'class-2', name: 'Class 2' },
      { id: 'class-3', name: 'Class 3' },
      { id: 'class-4', name: 'Class 4' },
      { id: 'class-5', name: 'Class 5' },
      { id: 'class-6', name: 'Class 6' },
    ],
    notes: '6 years of primary schooling; ends with NPSE.',
  },
  {
    id: 'jss',
    name: 'Junior Secondary School (JSS)',
    short: 'JSS',
    years: [
      { id: 'jss-1', name: 'JSS 1' },
      { id: 'jss-2', name: 'JSS 2' },
      { id: 'jss-3', name: 'JSS 3' },
    ],
    notes: '3 years; ends with BECE in some pathways.',
  },
  {
    id: 'sss',
    name: 'Senior Secondary School (SSS)',
    short: 'SSS',
    years: [
      { id: 'sss-1', name: 'SSS 1' },
      { id: 'sss-2', name: 'SSS 2' },
      { id: 'sss-3', name: 'SSS 3' },
    ],
    notes:
      '3 years; prepares students for WASSCE or technical/vocational tracks.',
  },
  {
    id: 'vocational',
    name: 'Technical / Vocational & Alternative Pathways',
    short: 'TVET',
    years: [
      { id: 'tvet-level-1', name: 'TVET Level 1' },
      { id: 'tvet-level-2', name: 'TVET Level 2' },
    ],
    notes: 'Includes vocational schools and apprenticeships.',
  },
];

export const SL_LEVEL_BY_ID: Record<string, EducationLevel> =
  SIERRA_LEONE_EDUCATION_LEVELS.reduce((acc, level) => {
    acc[level.id] = level;
    return acc;
  }, {} as Record<string, EducationLevel>);

export const optionListForSelect: { value: string; label: string }[] =
  SIERRA_LEONE_EDUCATION_LEVELS.map((level) => ({
    value: level.id,
    label: level.name,
  }));

export default SIERRA_LEONE_EDUCATION_LEVELS;
