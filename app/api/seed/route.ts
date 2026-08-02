import { NextResponse } from "next/server";
import { seedJobsIfEmpty } from "@/lib/firestore/seed";

export async function GET() {
  try {
    const seeded = await seedJobsIfEmpty(true);
    return NextResponse.json({
      success: true,
      message: seeded
        ? "Successfully seeded 100 USA jobs and companies into Firestore!"
        : "Database already contains jobs.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}