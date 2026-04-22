import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user
    const users = await prisma.$queryRaw`
      SELECT u.id, u.email, u.password, u.name, u.phone, u.role, u.status, u.emailVerified, u.phoneVerified, u.createdAt, u.lastLoginAt 
      FROM User u 
      WHERE u.email = ${email}
    `;
    const foundUser = users[0];

    if (!foundUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is suspended
    if (foundUser.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account suspended' },
        { status: 403 }
      );
    }

    // Check if dealer is not approved
    if (foundUser.role === 'DEALER' && foundUser.status === 'INACTIVE') {
      return NextResponse.json(
        { error: 'Dealer account pending approval' },
        { status: 403 }
      );
    }

    // Update last login
    const updateQuery = `
      UPDATE User 
      SET lastLoginAt = $1
      WHERE id = $2
    `;
    await prisma.$queryRaw(updateQuery, [new Date().toISOString(), foundUser.id]);

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: foundUser.id,
        email: foundUser.email,
        role: foundUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userWithoutPassword = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      phone: foundUser.phone,
      role: foundUser.role,
      status: foundUser.status,
      emailVerified: foundUser.emailVerified,
      phoneVerified: foundUser.phoneVerified,
      createdAt: foundUser.createdAt,
      lastLoginAt: foundUser.lastLoginAt
    };

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
