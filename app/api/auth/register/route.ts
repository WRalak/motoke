import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, role, kraPin, businessName, county } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role.toUpperCase(),
        status: role === 'DEALER' ? 'INACTIVE' : 'ACTIVE' // Dealers need approval
      }
    });

    // Create profile based on role
    if (role.toUpperCase() === 'DEALER') {
      await prisma.dealerProfile.create({
        data: {
          userId: user.id,
          businessName: businessName || name,
          kraPin: kraPin || '',
          county: county || 'Nairobi',
          city: county || 'Nairobi',
          address: '',
          phone: phone || '',
          email: email,
          mpesaNumber: phone || '',
          subscriptionPlan: 'FREE'
        }
      });
    } else if (role.toUpperCase() === 'CUSTOMER') {
      await prisma.customerProfile.create({
        data: {
          userId: user.id,
          county: county || 'Nairobi',
          city: county || 'Nairobi',
          dateOfBirth: new Date('1990-01-01'), // Default value
          preferences: JSON.stringify({
            vehicleTypes: [],
            priceRange: { min: 0, max: 10000000 },
            financing: true,
            insurance: false
          })
        }
      });
    }

    // Create notification for admin about new dealer registration
    if (role.toUpperCase() === 'DEALER') {
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      for (const admin of adminUsers) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'new_dealer',
            title: 'New Dealer Registration',
            message: `${businessName || name} has registered as a dealer and needs approval.`,
            data: {
              dealerId: user.id,
              businessName: businessName || name
            }
          }
        });
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
