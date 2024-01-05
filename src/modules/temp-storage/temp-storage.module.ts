// temp-storage.module.ts
import { Module } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';

@Module({
  providers: [TempStorageService],
  exports: [TempStorageService], // Export the service so it can be imported by other modules
})
export class TempStorageModule {}
