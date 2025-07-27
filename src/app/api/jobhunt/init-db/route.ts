import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, testDatabase } from '@/lib/jobhunt/db-init';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Initialize the database
    const db = await initializeDatabase();
    
    // Close the connection
    await db.close();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Running database tests...');
    
    // Run database tests
    await testDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database tests completed successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database tests failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database tests failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}