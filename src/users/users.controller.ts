import { Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, Param, Patch, Post, SetMetadata, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            await this.usersService.createUser(createUserDto);
            return {
                statusCode: 0,
                message: 'Registrasi Berhasil',
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException({
                    statusCode: 1,
                    message: error.message,
                });
            }
            // Untuk kesalahan lain, Anda bisa mengembalikan Internal Server Error
            throw new InternalServerErrorException({
                statusCode: 2,
                message: 'Terjadi kesalahan saat registrasi',
            });
        }
    }

    @Get()
    @SetMetadata('roles', ['Admin'])
    async getAllUsers() {
        const users = await this.usersService.getAllUsers();
        return {
            statusCode: 0,
            message: 'Data pengguna berhasil diambil',
            data: users,
        };
    }

    @Get(':id')
    @SetMetadata('roles', ['Admin'])
    async getUserById(@Param('id') id: string) {
        const user = await this.usersService.getUserById(id);
        return {
            statusCode: 0,
            message: 'Data pengguna berhasil diambil',
            data: user,
        };
    }

    @Patch(':id')
    @SetMetadata('roles', ['Admin', 'User'])
    async updateUser(@Request() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const currentUserId = req.user.id;
        const updatedUser = await this.usersService.updateUser(id, updateUserDto, currentUserId);
        return {
            statusCode: 0,
            message: 'Data pengguna berhasil diperbarui',
            data: updatedUser,
        };
    }

    @Delete(':id')
    @SetMetadata('roles', ['Admin'])
    async deleteUser(@Param('id') id: string) {
        await this.usersService.deleteUser(id);
        return {
            statusCode: 0,
            message: 'Pengguna berhasil dihapus',
        };
    }

}
