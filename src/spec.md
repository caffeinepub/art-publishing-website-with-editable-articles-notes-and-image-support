# Specification

## Summary
**Goal:** Add a one-time owner/admin bootstrap flow so the first Internet Identity principal can claim admin access to `/admin` when no admin exists, without any username/password.

**Planned changes:**
- Backend: add methods to (1) check whether an admin/owner already exists and (2) allow the current authenticated caller to claim/initialize owner/admin access only if none exists yet; otherwise fail without changing state.
- Backend: ensure the successfully-claimed principal is recognized by existing admin checks (e.g., `isCallerAdmin()` returns true).
- Frontend `/admin`: when signed out, show an owner-only screen with a “Sign in with Internet Identity” call-to-action using the existing login flow.
- Frontend `/admin`: when signed in but not admin, show “Claim Owner Access” only if no admin exists; on success, unlock the admin dashboard without a page reload.
- Frontend `/admin`: when signed in but not admin and an admin already exists, show a clear restricted-access message with no bypass path.

**User-visible outcome:** Visiting `/admin` prompts the owner to sign in with Internet Identity and, if no owner is set yet, claim owner/admin access once; after that, only the claimed principal can access the admin area.
