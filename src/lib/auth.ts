import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '../../prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // ! Uncomment the following lines to enable email and password authentication
  // trustedOrigins: [
  //   process.env.CORS_ORIGIN || "",
  // ],
  // emailAndPassword: {
  //   enabled: true,
  // }
});
