import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Redis client using the environment variable
const redis = new Redis(process.env.REDIS_URL);

async function testRedis() {
    try {
        console.log('Connecting to Upstash Redis...');
        
        // Set a test key
        await redis.set('test_key', 'ApexLedger Redis is working!');
        
        // Get the test key back
        const value = await redis.get('test_key');
        console.log('Success! Retrieved from Redis:', value);
        
        // Clean up
        await redis.del('test_key');
        
        process.exit(0);
    } catch (error) {
        console.error('Redis Connection Error:', error);
        process.exit(1);
    }
}

testRedis();