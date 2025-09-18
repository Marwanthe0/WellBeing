import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Test appointment booking with sample data
    const testData = {
      therapistId: 1,
      date: "2025-09-20",
      time: "10:00"
    };

    const response = await fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    return NextResponse.json({
      testResult: result,
      status: response.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}