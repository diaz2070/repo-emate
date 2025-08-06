import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { admin } from 'better-auth/plugins';
import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  plugins: [usernameClient(), adminClient({})],
});
