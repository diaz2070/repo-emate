import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '../../prisma';
import { admin, username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      active: {
        type: "boolean",
        defaultValue: true,
        required: false
      },
      registrationDate: {
        type: "date",
        defaultValue: () => new Date(),
        required: false
      }
    }
  },
  plugins: [
    username({
       minUsernameLength: 5,
        maxUsernameLength: 20,
    }),
    admin({
      adminRoles: ['admin', 'superadmin'],
      adminUserIds: process.env.ADMIN_USER_IDS?.split(',').map(id => id.trim()) || []
    }),
    nextCookies()
  ],
  // ! Uncomment the following lines to enable email and password authentication
  // trustedOrigins: [
  //   process.env.CORS_ORIGIN || "",
  // ],
  emailAndPassword: {
    enabled: true,
  }
});
