import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const vehicle = await db.vehicles.findById(id);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const dealer = await db.dealers.findById(vehicle.dealerId);

    return NextResponse.json({ ...vehicle, dealer });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...body,
        images: body.images ? JSON.stringify(body.images) : undefined,
        features: body.features ? JSON.stringify(body.features) : undefined,
      },
      include: {
        dealer: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await prisma.vehicle.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}
