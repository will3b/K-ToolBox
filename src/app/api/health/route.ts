import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';

  try {
    // Perform quick lightweight query to check SQLite availability
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    console.error('Healthcheck DB error:', err);
  }

  const isHealthy = dbStatus === 'connected';
  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      responseTimeMs: responseTime,
    },
    {
      status: isHealthy ? 200 : 503,
    }
  );
}
