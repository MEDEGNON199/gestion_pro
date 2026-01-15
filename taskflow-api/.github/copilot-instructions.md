# Copilot instructions for Taskflow API

Purpose
- Help AI agents become productive quickly in this NestJS + TypeORM codebase.

Big picture
- NestJS monolith organized by domain modules under `src/` (examples: [src/projets](src/projets), [src/taches](src/taches)).
- PostgreSQL via TypeORM configured centrally in [src/app.module.ts](src/app.module.ts).
- Auth is JWT-based: see [src/auth/auth.module.ts](src/auth/auth.module.ts) and `JwtStrategy`.

How to run & test (from repo root)
- Install: `npm install`
- Dev server: `npm run start:dev`
- Build: `npm run build`; production start: `npm run start:prod`
- Unit tests: `npm run test`; e2e: `npm run test:e2e`

Important conventions & patterns (use concrete files)
- Validation: global `ValidationPipe` in [src/main.ts](src/main.ts); DTOs use `class-validator` and are placed in `dto/` folders (e.g. [src/projets/dto](src/projets/dto)).
- Modules: one domain per module. Register entities in `TypeOrmModule.forFeature([...])` inside each module (e.g. [src/projets/projets.module.ts](src/projets/projets.module.ts)).
- Entities live in `entities/` subfolders and are imported into `AppModule`'s TypeOrm `entities` list (see [src/app.module.ts](src/app.module.ts)).
- Auth: controllers commonly protect routes with `@UseGuards(JwtAuthGuard)` and retrieve the user via `@CurrentUser()` (see [src/projets/projets.controller.ts](src/projets/projets.controller.ts)).
- Services contain business logic; controllers delegate to service methods with signature patterns like `create(dto, user)`, `findAll(user)`, `update(id, dto, user)`.

Database & environment
- DB connection configured in [src/app.module.ts](src/app.module.ts). Expected env vars: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`.
- JWT config via `ConfigService` expects `JWT_SECRET` and `JWT_EXPIRES_IN` (see [src/auth/auth.module.ts](src/auth/auth.module.ts)).
- `synchronize` is false in production config—migrations are expected (not present in repo); avoid enabling sync in prod.

Developer workflows & gotchas
- Use `npm run start:dev` for hot reload. Database must be available (Postgres) for integration tests or runtime.
- Tests: Jest runs TypeScript tests from `src` (see `jest` config in `package.json`). E2E config lives in `test/jest-e2e.json`.
- Lint & format: `npm run lint` and `npm run format`.

When adding an endpoint
1. Add DTO in `src/<domain>/dto/` and use `class-validator` decorators.
2. Add entity in `src/<domain>/entities/` and update module's `TypeOrmModule.forFeature`.
3. Implement service method in `src/<domain>/<domain>.service.ts`.
4. Add controller route in `src/<domain>/<domain>.controller.ts`, follow existing use of `@UseGuards(JwtAuthGuard)` and `@CurrentUser()`.

Files to review first
- [src/app.module.ts](src/app.module.ts) — DB, module imports
- [src/main.ts](src/main.ts) — global validation pipe and bootstrap
- [package.json](package.json) — run/test scripts
- [src/auth](src/auth) — JWT & CurrentUser patterns

Merge note
- No existing copilot/agent docs detected; if you have an existing `.github/copilot-instructions.md`, merge similar sections and preserve any custom tips.

If anything here is unclear, tell me which areas to expand (examples: DTO shapes, entity relations, or typical error responses).
