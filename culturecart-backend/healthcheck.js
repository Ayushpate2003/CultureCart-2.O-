const { Client } = require('pg');

async function healthCheck() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    console.log('✅ Database health check passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();
