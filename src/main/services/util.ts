import { classToPlain } from 'class-transformer';

export function normalizeEntity<T>(entites: T): T;
export function normalizeEntity<T>(entity: T[]): T[] {
  return classToPlain(entity) as typeof entity;
}
