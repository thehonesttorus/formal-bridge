# Formal Bridge Environment Setup

To configure Clerk Magic Link authentication, create a `.env.local` file with:

```
# Clerk Authentication (get from https://clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5200
```

## Clerk Setup Steps

1. Create account at https://clerk.com/
2. Create new application
3. Enable "Email Magic Link" as sign-in method
4. Copy Publishable Key and Secret Key to `.env.local`
5. Restart dev server
