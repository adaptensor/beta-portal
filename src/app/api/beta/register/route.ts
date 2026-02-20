import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role, company, aircraftTypes, currentSoftware, agreedToTerms } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { error: "You must agree to the beta testing terms" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await prisma.betaTester.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 409 }
      );
    }

    // Check if user is signed in with Clerk
    let clerkUserId: string | null = null;
    try {
      const { userId } = await auth();
      clerkUserId = userId;
    } catch {
      // Not signed in, that's fine for registration
    }

    // Create beta tester record
    const tester = await prisma.betaTester.create({
      data: {
        name,
        email,
        role,
        company: company || null,
        aircraftTypes: aircraftTypes || null,
        currentSoftware: currentSoftware || null,
        agreedToTerms: true,
        clerkUserId,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      id: tester.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
