import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const { status } = body;

    // Only allow status changes to 'available' (approved) or 'rejected'
    if (!['available', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Only "available" or "rejected" allowed.' },
        { status: 400 }
      );
    }

    // Get the vehicle first to check NTSA status
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        dealer: {
          include: {
            user: true
          }
        }
      }
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // If trying to approve but NTSA status is not cleared, reject the request
    if (status === 'available' && vehicle.ntsaStatus !== 'CLEARED') {
      return NextResponse.json(
        { error: 'Cannot approve vehicle with failed or pending NTSA status' },
        { status: 400 }
      );
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: { status },
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

    // Create notification for dealer
    await prisma.notification.create({
      data: {
        userId: vehicle.dealer.userId,
        type: 'vehicle_status',
        title: `Vehicle ${status === 'available' ? 'Approved' : 'Rejected'}`,
        message: `Your vehicle listing for ${vehicle.year} ${vehicle.make} ${vehicle.model} has been ${status}.`,
        data: {
          vehicleId: vehicle.id,
          status
        }
      }
    });

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error approving vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to approve vehicle' },
      { status: 500 }
    );
  }
}
