# Agent Guidelines – Social App

Base rules for AI agents and developers in this Express/Mongoose project. Follow these conventions for code and commits.

**Language:** All code, comments, commit messages, and documentation in this codebase must be in **English**.

---

## Commit conventions (Conventional Commits)

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for clear, machine-readable commit messages.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat:** new feature (correlates with MINOR in SemVer)
- **fix:** bug fix (correlates with PATCH in SemVer)
- **docs:** documentation only
- **style:** formatting, no code change (e.g. whitespace)
- **refactor:** neither a bug fix nor a new feature
- **perf:** performance improvement
- **test:** adding or updating tests
- **chore:** build, tooling, dependencies, etc.
- **ci:** CI configuration

### Scope (optional)

Use a short scope in parentheses, e.g. `feat(auth):`, `fix(api):`, `refactor(models):`.

### Breaking changes

- In the footer: `BREAKING CHANGE: <description>`
- Or in the type/scope: append `!` after type/scope, e.g. `feat(api)!: change that breaks existing API`

### Examples

```
feat(auth): add JWT login endpoint
fix(users): correct email validation
docs: update API readme
refactor(routes): extract handlers to controllers
feat(api)!: require Authorization header on all /api/* routes

BREAKING CHANGE: unauthenticated requests to /api/* now return 401
```

---

## TypeScript

- **Strict typing:** No `any` unless explicitly needed; use concrete types or `unknown` with type guards.
- **Interfaces/types:** Define interfaces for request bodies, responses, and Mongoose document extensions; reuse where possible.
- **ES modules:** The project uses `"type": "module"`; use `import`/`export`, not `require`.
- **Paths:** Use clear relative paths or (if configured) path aliases; avoid deep `../../../`.
- **Null/undefined:** Respect `strictNullChecks`; check for `null`/`undefined` where needed or use optional chaining (`?.`).

---

## Express

- **Routing:** Group routes logically (e.g. by resource: `routes/users.ts`, `routes/posts.ts`); mount them in `index.ts` or a central app setup.
- **Middleware:** Use middleware for cross-cutting concerns (auth, logging, error handling); order: logging → auth → routes → error handler.
- **Request/response:** Type request/response where possible (e.g. `Request<Params, ResBody, ReqBody, ReqQuery>`); avoid `any` on body/query.
- **Status codes:** Use appropriate HTTP status codes (200, 201, 400, 401, 404, 500, etc.).
- **Error handling:** Use a central error-handling middleware; do not expose raw errors to the client; log errors server-side.

---

## Mongoose

- **Schemas:** Define schemas in separate files (e.g. `models/User.ts`); export the model, not just the schema.
- **Types:** Use TypeScript interfaces for documents and combine with Mongoose `Schema`; consider `Document` + interface for methods/virtuals.
- **Validation:** Put validation in the schema (required, enum, min/max, custom validators) where possible; complex rules can live in middleware or service layer.
- **Queries:** Use `lean()` for read-only queries when you don't need Mongoose document methods (better performance).
- **Connection:** Use a single shared connection; avoid multiple `mongoose.connect()` calls across modules; wait for connection before the app listens.

---

## General principles

- **Structure:** Keep a clear folder structure (e.g. `src/routes`, `src/models`, `src/controllers`, `src/middleware`, `src/utils`).
- **Environment:** Sensitive config and secrets only via environment variables (e.g. `.env`); never commit `.env` or real secrets.
- **Code style:** Consistent formatting (e.g. Prettier) and a linter (e.g. ESLint) for TypeScript/Express where possible.
- **Dependencies:** Add only needed dependencies; manage versions in `package.json` and lockfile.

---

*Last updated: March 2025*
