import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma.service'; // Pastikan PrismaService diimport
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User diambil dari JWT payload

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true; // Tidak ada role yang diperlukan, akses diberikan
    }

    // Ambil role dari database berdasarkan ID pengguna yang login
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: true, // Mengambil role terkait pengguna
      },
    });

    if (!dbUser) {
      throw new ForbiddenException('User tidak ditemukan');
    }

    const userRoleName = dbUser.role.name; // Role name pengguna

    // Cek apakah role pengguna cocok dengan role yang diperlukan
    if (requiredRoles.includes(userRoleName)) {
      return true; // Pengguna dapat mengakses
    }

    throw new ForbiddenException('Anda tidak memiliki akses untuk melakukan aksi ini');
  }
}
