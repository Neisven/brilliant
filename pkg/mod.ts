import { readJson, writeJson } from "https://deno.land/std/fs/mod.ts";

class Database {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async loadData(): Promise<Record<string, any>> {
    try {
      const data = await readJson(this.filePath);
      return data;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return {};
      } else {
        throw new Error(`Unable to load data: ${error.message}`);
      }
    }
  }

  private async saveData(data: Record<string, any>): Promise<void> {
    try {
      await writeJson(this.filePath, data, { create: true });
    } catch (error) {
      throw new Error(`Unable to save data: ${error.message}`);
    }
  }

  async get(key: string): Promise<any> {
    const db = await this.loadData();
    return db[key];
  }

  async set(key: string, value: any): Promise<void> {
    const db = await this.loadData();
    db[key] = value;
    await this.saveData(db);
  }

  async remove(key: string): Promise<void> {
    const db = await this.loadData();
    delete db[key];
    await this.saveData(db);
  }

  async clear(): Promise<void> {
    await this.saveData({});
  }
}
