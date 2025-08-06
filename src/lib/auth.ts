import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '../../prisma';
import { admin, username } from 'better-auth/plugins';


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [
    username({
       minUsernameLength: 5,
        maxUsernameLength: 20,
    }),
    admin({
      adminRoles: ['admin', 'superadmin'],
      adminUserIds: ["rQZ72TUknwirPf7n232TrV14kzVpxfRm"]
    })
  ],
  // ! Uncomment the following lines to enable email and password authentication
  // trustedOrigins: [
  //   process.env.CORS_ORIGIN || "",
  // ],
  emailAndPassword: {
    enabled: true,
  }
});
