# Specification

## Summary
**Goal:** Reset and migrate admin authentication to use a single admin username + password pair, update login flow accordingly, and ensure credentials persist across canister upgrades.

**Planned changes:**
- Update the backend admin credential model to store/verify a username + password pair and require both in the admin login API while continuing to use the existing session token for admin-gated APIs.
- Implement a backend credential reset to set admin username to "adminankit" and admin password to "ankits-0812", ensuring credential updates require an existing valid admin session when credentials already exist.
- Persist admin credentials in stable state across canister upgrades and add a conditional migration to map any existing password-only credential into the new username+password structure.
- Update the frontend admin login UI and session hook to collect username + password, call the updated login API, and display English error messaging on invalid credentials.

**User-visible outcome:** Admins can log in using username "adminankit" and password "ankits-0812"; login requires both fields, invalid logins show an English error, admin access continues to use the existing session token, and credentials persist through upgrades.
