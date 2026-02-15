# Specification

## Summary
**Goal:** Hide all public authentication UI while keeping all publishing and image upload capabilities restricted to the site owner only.

**Planned changes:**
- Remove public-facing login/logout controls and profile setup UX from the site layout and public pages.
- Keep admin/editor routes gated so non-owners cannot access create/edit/publish/unpublish UI or actions, even if they navigate directly to admin URLs.
- Ensure backend content mutation and image upload operations reject non-owner callers with unauthorized errors.
- Update admin gating/access-denied messaging to clearly indicate owner/admin-only access and remove any implication of general user accounts (English only).

**User-visible outcome:** Visitors can browse the site without seeing any login/logout or profile setup options, and only the site owner can access admin pages and publish/unpublish articles or upload images.
