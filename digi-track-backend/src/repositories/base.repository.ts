import { db, DatabaseSchema } from '../config/database';

export class BaseRepository<T extends { id: string }> {
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
    const list = filter ? all.filter(filter) : all;
    return list.map((i) => ({ ...i }));
  }

  async create(item: T): Promise<T> {
    this.collection[item.id] = { ...item };
    db.save();
    return { ...item };
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = this.collection[id];
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: Date.now() };
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
