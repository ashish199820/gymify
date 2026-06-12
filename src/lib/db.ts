import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { WorkoutPlan, WorkoutSession, UserProfile } from './types';

interface GymDB extends DBSchema {
  plans: {
    key: string;
    value: WorkoutPlan;
    indexes: { 'by-date': string };
  };
  sessions: {
    key: string;
    value: WorkoutSession;
    indexes: { 'by-date': string; 'by-plan': string };
  };
  profile: {
    key: string;
    value: UserProfile;
  };
}

let dbInstance: IDBPDatabase<GymDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<GymDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<GymDB>('gymflow-db', 1, {
    upgrade(db) {
      const planStore = db.createObjectStore('plans', { keyPath: 'id' });
      planStore.createIndex('by-date', 'createdAt');

      const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
      sessionStore.createIndex('by-date', 'startedAt');
      sessionStore.createIndex('by-plan', 'planId');

      db.createObjectStore('profile', { keyPath: 'id' });
    },
  });

  return dbInstance;
}

// ─── Plans ────────────────────────────────────────────────────────────────────
export const plansDB = {
  async getAll() { return (await getDB()).getAll('plans'); },
  async get(id: string) { return (await getDB()).get('plans', id); },
  async save(plan: WorkoutPlan) { return (await getDB()).put('plans', plan); },
  async delete(id: string) { return (await getDB()).delete('plans', id); },
};

// ─── Sessions ────────────────────────────────────────────────────────────────
export const sessionsDB = {
  async getAll() { return (await getDB()).getAll('sessions'); },
  async get(id: string) { return (await getDB()).get('sessions', id); },
  async save(session: WorkoutSession) { return (await getDB()).put('sessions', session); },
  async delete(id: string) { return (await getDB()).delete('sessions', id); },
  async getByPlan(planId: string) {
    return (await getDB()).getAllFromIndex('sessions', 'by-plan', planId);
  },
};

// ─── Profile ─────────────────────────────────────────────────────────────────
export const profileDB = {
  async get() { const all = await (await getDB()).getAll('profile'); return all[0] ?? null; },
  async save(profile: UserProfile) { return (await getDB()).put('profile', profile); },
};
