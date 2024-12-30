import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto) {
        const { nama, email, password, roleId } = createUserDto;

        // Cek apakah email sudah digunakan
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email sudah terdaftar');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user ke database
        return this.prisma.user.create({
            data: {
                nama,
                email,
                password: hashedPassword,
                roleId,
            },
        });
    }

    async getAllUsers() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                nama: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    },
                },
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },

        });
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nama: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    },
                },
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException('Pengguna tidak ditemukan');
        }
        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto, currentUserId: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('Pengguna tidak ditemukan');
        }

        // Jika user bukan Admin, hanya bisa mengupdate dirinya sendiri
        if (id !== currentUserId) {
            throw new ForbiddenException('Anda hanya bisa memperbarui data Anda sendiri');
        }

        // Hash password jika ada
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }


    async deleteUser(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('Pengguna tidak ditemukan');
        }

        await this.prisma.user.delete({ where: { id } });
        return { message: 'Pengguna berhasil dihapus' };
    }

}
