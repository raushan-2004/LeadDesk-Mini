import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Lead } from '@/models/Lead';
import { leadSchema } from '@/lib/validations/lead';
import { LEAD_STATUSES, LeadStatus } from '@/constants/lead';


// Helper to escape special regex characters for safe search query construction
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Consistent JSON error format helpers
function formatValidationError(errors: Record<string, string[]>) {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid submission',
      fields: errors,
    },
  };
}

function formatGenericError(message: string, code = 'SERVER_ERROR') {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

/**
 * POST /api/leads
 * Creates a new lead from the public conversion form.
 * Strictly validates inputs, normalizes fields, and forces status to "NEW".
 */
export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        formatGenericError('Malformed JSON payload', 'BAD_REQUEST'),
        { status: 400 }
      );
    }

    // Strict Zod parsing
    const result = leadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        formatValidationError(result.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    // Destructure only permitted fields to prevent mass assignment
    const { name, email, budget, message } = result.data;

    // Normalization
    const normalizedLead = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      budget,
      message: message.trim(),
      status: 'NEW' as const, // Always force status to NEW for public POST requests
    };

    // Establish DB connection
    await connectToDatabase();

    // Save document to MongoDB Atlas
    const newLead = await Lead.create(normalizedLead);

    // Format safe response (exclude Mongoose internal version key __v)
    const responseData = {
      _id: newLead._id,
      name: newLead.name,
      email: newLead.email,
      budget: newLead.budget,
      message: newLead.message,
      status: newLead.status,
      createdAt: newLead.createdAt,
      updatedAt: newLead.updatedAt,
    };

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      formatGenericError('Internal server error', 'SERVER_ERROR'),
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads
 * Retrieves leads sorted from newest to oldest.
 * Supports status filtering (?status=...) and regex-safe query search (?search=...).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status')?.trim();

    const query: Record<string, unknown> = {};

    // Validate status filter if present
    if (status) {
      if (!LEAD_STATUSES.includes(status as LeadStatus)) {
        return NextResponse.json(
          formatGenericError(
            `Invalid status filter: ${status}. Must be one of: ${LEAD_STATUSES.join(', ')}`,
            'BAD_REQUEST'
          ),
          { status: 400 }
        );
      }
      query.status = status;
    }

    // Escape and apply regex search to name or email fields
    if (search) {
      const escapedSearch = escapeRegExp(search);
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    // Connect to database
    await connectToDatabase();

    // Query leads sorted by newest first, lean, excluding __v
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    return NextResponse.json(
      { success: true, data: leads },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error listing leads:', error);
    return NextResponse.json(
      formatGenericError('Internal server error', 'SERVER_ERROR'),
      { status: 500 }
    );
  }
}
