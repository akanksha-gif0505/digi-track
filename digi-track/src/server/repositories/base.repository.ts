import { db, DatabaseSchema } from '../config/database';

export interface IBaseRepository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: (item: T) => boolean): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export class BaseRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected collectionName: keyof DatabaseSchema;

  constructor(collectionName: keyof DatabaseSchema) {
    this.collectionName = collectionName;
  }

  protected get collection(): Record<string, T> {
    return db.getCollection<T>(this.collectionName);
  }

  async findById(id: string): Promise<T | null> {
    const item = this.collection[id];
    return item ? { ...item } : null;
  }

  async findAll(filter?: (item: T) => boolean): Promise<T[]> {
    const all = Object.values(this.collection);
    if (!filter) return all.map((i) => ({ ...i }));
    return all.filter(filter).map((i) => ({ ...i }));
  }

  async create(item: T): Promise<T> {
    this.collection[item.id] = { ...item };
    db.save();
    return { ...item };
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = this.collection[id];
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };
    this.collection[id] = updated;
    db.save();
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    if (!this.collection[id]) return false;
    delete this.collection[id];
    db.save();
    return true;
  }
}
