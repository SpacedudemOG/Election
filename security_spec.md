# Security Specification for Texas City Election Tracker

## 1. Data Invariants
- **Candidates:** 
  - Every candidate must have a name, position, and location (Texas City or La Marque).
  - Background must be a string <= 2000 chars.
  - Socials and Sources arrays must be bounded.
  - `lastUpdated` must match the server request time.
- **Election Intelligence:**
  - `query` must be a string.
  - `data` is a large JSON stringified block.
  - `updatedAt` must match the server request time.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. **Candidate Identity Spoofing:** Create a candidate with a 1MB name string.
2. **Location Poisoning:** Set location to "Houston" (unsupported city).
3. **Immutability Breach:** Attempt to change a candidate's `id` during update.
4. **Timestamp Fraud:** Provide a client-side date instead of `request.time`.
5. **PII Leak:** (N/A for this public tracker, but rules should default-deny private fields).
6. **Shadow Fields:** Add `isAdmin: true` to a candidate document.
7. **Intelligence Size Attack:** Write a 2MB string to the intelligence cache.
8. **Relational Break:** Create a candidate with no position.
9. **Anonymous Spam:** Delete all candidates.
10. **Path Injection:** Use `../` characters in a `candidateId`.
11. **Type Poisoning:** Send a boolean where a string (position) is expected.
12. **Recursive List Attack:** Query for All candidates without any auth-based limit (though read is currently public).

## 3. Deployment Strategy
- Use `rules_version = '2'`.
- Default deny all.
- Public read for election data.
- Structured write for background sync.
