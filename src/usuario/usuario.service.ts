import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
    const newUser = this.usuarioRepository.create({
      email: createUsuarioDto.email,
      password: hashedPassword,
    });
    return this.usuarioRepository.save(newUser);
  }

  async login(authDto: AuthDto): Promise<{ message: string; token?: string }> {
    const user = await this.usuarioRepository.findOne({
      where: { email: authDto.email },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Aquí deberías generar un token JWT (o manejar la sesión)
    return { message: 'Inicio de sesión exitoso' };
  }
  async findByEmail(email: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({
      where: { email },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    return this.usuarioRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateUsuarioDto: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar el correo si se proporciona
    if (updateUsuarioDto.email) {
      usuario.email = updateUsuarioDto.email;
    }

    // Actualizar la contraseña si se proporciona
    if (updateUsuarioDto.password) {
      const hashedPassword = await bcrypt.hash(updateUsuarioDto.password, 10);
      usuario.password = hashedPassword;
    }

    // Guardar los cambios en la base de datos
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}

