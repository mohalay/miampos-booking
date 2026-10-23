export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Lundi',
  tue: 'Mardi',
  wed: 'Mercredi',
  thu: 'Jeudi',
  fri: 'Vendredi',
  sat: 'Samedi',
  sun: 'Dimanche',
};

export const DAY_SHORT_LABELS: Record<DayKey, string> = {
  mon: 'Lun',
  tue: 'Mar',
  wed: 'Mer',
  thu: 'Jeu',
  fri: 'Ven',
  sat: 'Sam',
  sun: 'Dim',
};

export interface TimeRange {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface DaySchedule {
  isOpen: boolean;
  ranges: TimeRange[];
}

export type WeeklySchedule = Record<DayKey, DaySchedule>;

export function getDefaultWeeklySchedule(): WeeklySchedule {
  return {
    mon: { isOpen: true, ranges: [{ start: '09:00', end: '19:00' }] },
    tue: { isOpen: true, ranges: [{ start: '09:00', end: '19:00' }] },
    wed: { isOpen: true, ranges: [{ start: '09:00', end: '19:00' }] },
    thu: { isOpen: true, ranges: [{ start: '09:00', end: '20:00' }] },
    fri: { isOpen: true, ranges: [{ start: '09:00', end: '20:00' }] },
    sat: { isOpen: true, ranges: [{ start: '09:00', end: '18:30' }] },
    sun: { isOpen: false, ranges: [] },
  };
}

export function parseWeeklySchedule(raw?: string | null): WeeklySchedule {
  const fallback = getDefaultWeeklySchedule();
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return fallback;
  }

  const clean = raw.trim();
  if (clean.startsWith('{')) {
    try {
      const parsed = JSON.parse(clean);
      const daysData = parsed.days || parsed;
      const result: Partial<WeeklySchedule> = {};

      for (const k of DAY_KEYS) {
        if (daysData[k]) {
          const d = daysData[k];
          const rawRanges: any[] = Array.isArray(d.ranges) ? d.ranges : [];
          const validRanges: TimeRange[] = rawRanges
            .filter(r => r && typeof r.start === 'string' && typeof r.end === 'string')
            .map(r => ({
              start: r.start.slice(0, 5),
              end: r.end.slice(0, 5)
            }));

          result[k] = {
            isOpen: Boolean(d.isOpen),
            ranges: validRanges
          };
        } else {
          result[k] = fallback[k];
        }
      }
      return result as WeeklySchedule;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function getDayKeyFromDate(date: Date): DayKey {
  const day = date.getDay(); // 0 is Sunday, 1 is Monday
  const map: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return map[day];
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function generateAvailableSlots(
  date: Date,
  schedule: WeeklySchedule,
  serviceDurationMinutes: number = 30,
  stepMinutes: number = 15
): string[] {
  const dayKey = getDayKeyFromDate(date);
  const dayConfig = schedule[dayKey];

  if (!dayConfig || !dayConfig.isOpen || dayConfig.ranges.length === 0) {
    return [];
  }

  const duration = Math.max(15, serviceDurationMinutes);
  const slots: string[] = [];
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const currentMinutesToday = now.getHours() * 60 + now.getMinutes() + 30; // 30 min buffer for today

  for (const range of dayConfig.ranges) {
    const startMin = timeToMinutes(range.start);
    const endMin = timeToMinutes(range.end);

    for (let current = startMin; current + duration <= endMin; current += stepMinutes) {
      if (isToday && current < currentMinutesToday) {
        continue;
      }
      slots.push(minutesToTime(current));
    }
  }

  return slots;
}
