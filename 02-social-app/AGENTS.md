# Agent Guidelines – Social App

Basisregels voor AI-agents en ontwikkelaars in dit Express/Mongoose-project. Houd je aan deze afspraken bij code- en commit-wijzigingen.

---

## Commit conventions (Conventional Commits)

We gebruiken [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) voor duidelijke, machine-leesbare commitberichten.

### Formaat

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat:** nieuwe feature (correleert met MINOR in SemVer)
- **fix:** bugfix (correleert met PATCH in SemVer)
- **docs:** alleen documentatie
- **style:** formatting, geen code-change (bijv. whitespace)
- **refactor:** geen bugfix, geen nieuwe feature
- **perf:** performance-verbetering
- **test:** tests toevoegen of aanpassen
- **chore:** build, tooling, dependencies, etc.
- **ci:** CI-configuratie

### Scope (optioneel)

Gebruik een korte scope tussen haakjes, bijv. `feat(auth):`, `fix(api):`, `refactor(models):`.

### Breaking changes

- In de footer: `BREAKING CHANGE: <beschrijving>`
- Of direct in type/scope: type/scope afsluiten met `!`, bijv. `feat(api)!: wijziging die bestaande API breekt`

### Voorbeelden

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

- **Strict typing:** Geen `any` tenzij expliciet nodig; gebruik concrete types of `unknown` en type guards.
- **Interfaces/types:** Definieer interfaces voor request bodies, responses en Mongoose document-extensions; hergebruik waar mogelijk.
- **ES modules:** Het project gebruikt `"type": "module"`; gebruik `import`/`export`, geen `require`.
- **Paths:** Importeer met duidelijke relatieve paden of (als geconfigureerd) path aliases; vermijd diepe `../../../`.
- **Null/undefined:** Hanteer `strictNullChecks`; check waar nodig op `null`/`undefined` of gebruik optional chaining (`?.`).

---

## Express

- **Routing:** Groepeer routes logisch (bijv. per resource: `routes/users.ts`, `routes/posts.ts`); mount ze in `index.ts` of een centrale app-setup.
- **Middleware:** Gebruik middleware voor cross-cutting concerns (auth, logging, error handling); volg de volgorde: logging → auth → routes → error handler.
- **Request/response:** Typ request/response waar mogelijk (bijv. `Request<Params, ResBody, ReqBody, ReqQuery>`); vermijd `any` op body/query.
- **Statuscodes:** Gebruik passende HTTP-statuscodes (200, 201, 400, 401, 404, 500, etc.).
- **Error handling:** Gebruik een centrale error-handling middleware; gooi geen ruwe errors naar de client; log errors server-side.

---

## Mongoose

- **Schemas:** Definieer schemas in aparte bestanden (bijv. `models/User.ts`); exporteer het model, niet alleen het schema.
- **Types:** Gebruik TypeScript-interfaces voor documenten en combineer met Mongoose `Schema`; overweeg `Document` + interface voor methods/virtuals.
- **Validatie:** Doe validatie in het schema (required, enum, min/max, custom validators) waar mogelijk; complexe regels kunnen in middleware of service-laag.
- **Queries:** Gebruik `lean()` voor read-only queries waar je geen Mongoose document-methods nodig hebt (betere performance).
- **Connectie:** Gebruik één gedeelde connectie; voorkom meerdere `mongoose.connect()`-calls in verschillende modules; wacht op connectie voordat de app luistert.

---

## Algemene principes

- **Structuur:** Houd een duidelijke mapstructuur (bijv. `src/routes`, `src/models`, `src/controllers`, `src/middleware`, `src/utils`).
- **Environment:** Gevoelige configuratie en secrets alleen via environment variables (bijv. `.env`); commit geen `.env` of echte secrets.
- **Code style:** Consistente formatting (bijv. Prettier) en waar mogelijk een linter (bijv. ESLint) voor TypeScript/Express.
- **Dependencies:** Voeg alleen benodigde dependencies toe; beheer versies in `package.json` en lockfile.

---

*Laatste aanpassing: maart 2025*
