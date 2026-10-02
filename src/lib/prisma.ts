import { neonConfig, PoolConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Configure Neon to use the WebSocket constructor from 'ws' in Node.js environments
neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
  const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
  };
  const adapter = new PrismaNeon(poolConfig);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
