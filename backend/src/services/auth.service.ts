import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

export class AuthService {
  private userRepository = new UserRepository();

  async register(
    name: string,
    email: string,
    password: string
  ) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError("Email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError("Invalid email or password", 401);
    }

    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}