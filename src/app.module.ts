import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Membuat konfigurasi tersedia di seluruh aplikasi
  }),
  AuthModule,UsersModule],
  providers: [PrismaService],
})
export class AppModule {}
