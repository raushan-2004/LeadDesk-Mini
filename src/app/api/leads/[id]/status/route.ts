import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { Lead } from '@/models/Lead';
import { leadStatusSchema } from '@/lib/validations/lead';

function formatGenericError(message: string, code = 'SERVER_ERROR') {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

function formatValidationError(errors: Record<string, string[]>) {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid status update payload',
      fields: errors,
    },
  };
}

/**
 * PATCH /api/leads/[id]/status
 * Updates the status of an existing lead.
 * Validates dynamic ID is a valid MongoDB ObjectId.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15/16, params is a Promise and must be awaited.
    const { id } = await params;

    // 1. Validate route ID exists and is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        formatGenericError('Invalid Lead ID format', 'BAD_REQUEST'),
        { status: 400 }
      );
    }

    // 2. Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        formatGenericError('Malformed JSON payload', 'BAD_REQUEST'),
        { status: 400 }
      );
    }

    // 3. Validate status using strict leadStatusSchema
    const result = leadStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        formatValidationError(result.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const { status } = result.data;

    // 4. Connect MongoDB
    await connectToDatabase();

    // 5. Find + update Lead (only status, to prevent mass assignment of other properties)
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    )
      .select('-__v')
      .lean();

    // 6. Return 404 if Lead doesn't exist
    if (!updatedLead) {
      return NextResponse.json(
        formatGenericError('Lead not found', 'NOT_FOUND'),
        { status: 404 }
      );
    }

    // 7. Successful update
    return NextResponse.json(
      { success: true, data: updatedLead },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      formatGenericError('Internal server error', 'SERVER_ERROR'),
      { status: 500 }
    );
  }
}
