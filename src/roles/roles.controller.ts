import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpStatus,
    HttpCode,
    SetMetadata,
  } from '@nestjs/common';
  import { RolesService } from './roles.service';
  import { CreateRoleDto } from './dto/create-role.dto';
  import { UpdateRoleDto } from './dto/update-role.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  
  @Controller('roles')
  @UseGuards(JwtAuthGuard, RolesGuard) // Hanya user yang login dan admin bisa mengakses
  @Roles('Admin') // Hanya Admin yang boleh mengakses semua endpoint ini
  export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @SetMetadata('roles', ['Admin'])
    async create(@Body() createRoleDto: CreateRoleDto) {
      return {
        code: 0,
        message: 'Role created successfully',
        data: await this.rolesService.create(createRoleDto),
      };
    }
  
    @Get()
    async findAll() {
      return {
        code: 0,
        message: 'Roles fetched successfully',
        data: await this.rolesService.findAll(),
      };
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return {
        code: 0,
        message: 'Role fetched successfully',
        data: await this.rolesService.findOne(id),
      };
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateRoleDto: UpdateRoleDto,
    ) {
      return {
        code: 0,
        message: 'Role updated successfully',
        data: await this.rolesService.update(id, updateRoleDto),
      };
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      await this.rolesService.remove(id);
      return {
        code: 0,
        message: 'Role deleted successfully',
      };
    }
  }
  