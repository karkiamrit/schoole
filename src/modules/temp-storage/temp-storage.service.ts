// temp-storage.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TempStorageService {
  private storage: Map<string, any> = new Map();

  store(key: string, value: any) {
    this.storage.set(key, value);
  }

  retrieve(key: string): any {
    return this.storage.get(key);
  }

  remove(key: string) {
    this.storage.delete(key);
  }
}
