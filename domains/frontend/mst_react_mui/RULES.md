# <PROJECT> Architecture Rules

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: MobX-State-Tree (MST)
- **Validation**: Zod schemas
- **UI Library**: Material-UI (MUI)
- **Build Tool**: Vite
- **API Communication**: Axios via ApiClient

---

## 1. SCHEMA LAYER RULES

### Type Definitions
✅ REQUIRED: Define ALL data types using Zod schemas as the single source of truth
✅ REQUIRED: Infer TypeScript types from Zod schemas using `z.infer<typeof Schema>`
✅ REQUIRED: Export both schema and inferred type from schema files
❌ FORBIDDEN: Create raw TypeScript types for API data
❌ FORBIDDEN: Duplicate type definitions across files
❌ FORBIDDEN: Use `any` type for API responses

### File Organization
✅ REQUIRED: Place schemas in `schemas/entity/entity.ts`
✅ REQUIRED: Place converters in `schemas/entity/entity.converters.ts`
✅ REQUIRED: Use path alias `@schemas/*` for imports

### Converters
✅ REQUIRED: Create converter object with `fromZod` and `toZod` methods
✅ REQUIRED: `fromZod` converts API response (Zod type) to MST snapshot
✅ REQUIRED: `toZod` converts MST model to API request (Zod type)
✅ REQUIRED: Add UI-specific fields (like `isLoading`) in `fromZod` only
❌ FORBIDDEN: Add UI-specific fields to Zod schemas

---

## 2. SERVICE LAYER RULES

### Class Structure
✅ REQUIRED: Use class-based services with singular entity names (e.g., `EntityService`)
✅ REQUIRED: Accept `ApiClient` in constructor with default parameter
✅ REQUIRED: Export singleton instance: `export const entityService = new EntityService()`
✅ REQUIRED: Use `private readonly apiClient: ApiClient` property

### API Communication
✅ REQUIRED: Type all API responses as `unknown` initially
✅ REQUIRED: Validate ALL API responses with Zod schemas using `.parse()`
✅ REQUIRED: Use centralized `API_ENDPOINTS` from `@utils/constants`
❌ FORBIDDEN: Hardcode endpoint URLs in service methods
❌ FORBIDDEN: Return unvalidated data from services
❌ FORBIDDEN: Perform state management in services

### Error Handling
✅ REQUIRED: Wrap ALL service methods in try-catch blocks
✅ REQUIRED: Use `errorService.handleServiceError(error, 'Service.method', context)` for ALL errors
✅ REQUIRED: Include context object with relevant IDs (e.g., `{ EntityId: id }`)
✅ REQUIRED: Let `handleServiceError` throw - do NOT catch and return
❌ FORBIDDEN: Use `console.error()` or `console.log()` for errors
❌ FORBIDDEN: Throw raw `Error` objects
❌ FORBIDDEN: Return `null` or `undefined` on errors without throwing

### Method Signatures
✅ REQUIRED: Use async/await for all asynchronous operations
✅ REQUIRED: Return Promise of validated Zod type
✅ REQUIRED: Accept typed request parameters using Zod types

### Imports
✅ REQUIRED: Import from `@services/ErrorService`
✅ REQUIRED: Import types from `@schemas/*`
✅ REQUIRED: Import constants from `@utils/constants`

---

## 3. STORE LAYER RULES

### Model Structure
✅ REQUIRED: Use MST `types.model()` for all models
✅ REQUIRED: Define models in `stores/models/entity/EntityModel.ts`
✅ REQUIRED: Define stores in `stores/models/entity/EntityStore.ts`
✅ REQUIRED: Use plural entity names for stores (e.g., `EntityStore`)

### State Properties
✅ REQUIRED: Include `isLoading: types.optional(types.boolean, false)` for async operations
✅ REQUIRED: Include `error: types.maybe(types.string)` for user-friendly error messages
✅ REQUIRED: Use `types.array()` for collections
✅ REQUIRED: Use `types.maybe()` for nullable values
✅ REQUIRED: Use `types.optional()` with default values

### Async Actions
✅ REQUIRED: Use `flow(function* () {})` for ALL async actions
✅ REQUIRED: Use `yield` instead of `await` inside flow functions
✅ REQUIRED: Set `isLoading = true` at start, `false` in finally block
✅ REQUIRED: Clear error state at action start: `self.error = undefined`
❌ FORBIDDEN: Use `async/await` in MST actions
❌ FORBIDDEN: Use arrow functions with flow: `flow(() => {})` is invalid

### Service Integration
✅ REQUIRED: Call services from stores, never call `apiClient` directly
✅ REQUIRED: Use converters to transform Zod types to MST snapshots
✅ REQUIRED: Import services: `import { entityService } from '@services/EntityService'`
❌ FORBIDDEN: Perform API calls directly in stores
❌ FORBIDDEN: Perform validation in stores (validation happens in services)

### Error Handling
✅ REQUIRED: Wrap ALL async operations in try-catch-finally blocks
✅ REQUIRED: Use `errorService.handleStoreError(error, 'Store.action', context)` in catch blocks
✅ REQUIRED: Store returned user-friendly message in `self.error`
✅ REQUIRED: Include context object with relevant IDs
❌ FORBIDDEN: Use `console.error()` for error logging
❌ FORBIDDEN: Expose technical error messages to UI
❌ FORBIDDEN: Re-throw errors unless component needs to handle them

### Computed Views
✅ REQUIRED: Define computed values in `.views()` block
✅ REQUIRED: Use `get` accessor for computed properties
✅ REQUIRED: Keep views pure (no side effects)

---

## 4. COMPONENT LAYER RULES

### Observer Pattern
✅ REQUIRED: Wrap ALL components that read store state with `observer()`
✅ REQUIRED: Import: `import { observer } from 'mobx-react-lite'`
✅ REQUIRED: Pass stores as props (dependency injection pattern)
❌ FORBIDDEN: Import stores directly in components
❌ FORBIDDEN: Create components that both read and don't observe stores

### Component Structure
✅ REQUIRED: Use functional components with TypeScript
✅ REQUIRED: Define prop types interface
✅ REQUIRED: Use Material-UI components consistently
✅ REQUIRED: Handle loading states: check `store.isLoading`
✅ REQUIRED: Handle error states: check `store.error`

### Error Handling
✅ REQUIRED: Use `errorService.handleComponentError(error, 'Component.handler', showNotification)` for ALL errors
✅ REQUIRED: Import and use `useNotification` hook for user feedback
✅ REQUIRED: Display store error state using Material-UI Alert component
✅ REQUIRED: Wrap user actions in try-catch blocks
❌ FORBIDDEN: Use `console.error()` for error logging
❌ FORBIDDEN: Ignore error state from stores

### User Feedback
✅ REQUIRED: Show success notifications for user actions
✅ REQUIRED: Show error notifications via `errorService.handleComponentError`
✅ REQUIRED: Use Material-UI Snackbar/Alert for notifications

### Data Fetching
✅ REQUIRED: Trigger data fetching in `useEffect` hooks
✅ REQUIRED: Include store in dependency array
✅ REQUIRED: Call store actions, never call services directly

---

## 5. ERROR HANDLING RULES

### Service Layer
✅ REQUIRED: Use `throw errorService.handleServiceError(error, 'Service.method', context)`
✅ REQUIRED: Include context object with relevant IDs
✅ REQUIRED: Let error propagate to store layer
❌ FORBIDDEN: Return null/undefined on errors
❌ FORBIDDEN: Catch errors without re-throwing

### Store Layer
✅ REQUIRED: Use `const message = errorService.handleStoreError(error, 'Store.action', context)`
✅ REQUIRED: Set `self.error = message` to store user-friendly message
✅ REQUIRED: Clear error at action start: `self.error = undefined`
❌ FORBIDDEN: Expose technical error details to UI
❌ FORBIDDEN: Re-throw errors unless component needs them

### Component Layer
✅ REQUIRED: Use `errorService.handleComponentError(error, 'Component.handler', showNotification)`
✅ REQUIRED: Display store error state from `store.error`
✅ REQUIRED: Wrap user actions in try-catch
❌ FORBIDDEN: Use raw console.error() or alert()

### Error Context
✅ REQUIRED: Include function name in context: `'EntityService.getEntity'`
✅ REQUIRED: Include relevant IDs in context object: `{ EntityId, AnotherEntityId }`
✅ REQUIRED: Use consistent naming: `Service.method`, `Store.action`, `Component.handler`

---

## 6. FILE ORGANIZATION RULES

### Directory Structure
✅ REQUIRED: Follow this structure exactly:
- `schemas/entity/` - Zod schemas and converters
- `services/` - API services (flat, no subdirectories)
- `stores/models/entity/` - MST models and stores
- `components/Entity/` - React components

### Naming Conventions
✅ REQUIRED: Services use singular nouns: `EntityService.ts`
✅ REQUIRED: Stores use plural nouns: `EntityStore.ts`
✅ REQUIRED: Models match store name: `EntityModel.ts`
✅ REQUIRED: Component folders use PascalCase: `EntityDashboard/`
✅ REQUIRED: Export `index.ts` from component folders

### File Exports
✅ REQUIRED: Export singleton from services: `export const entityService = new EntityService()`
✅ REQUIRED: Export model instance type: `export type IEntityModel = Instance<typeof EntityModel>`
✅ REQUIRED: Export store instance type: `export type IEntityStore = Instance<typeof EntityStore>`
✅ REQUIRED: Export both schema and type from schema files

---

## 7. IMPORT RULES

### Path Aliases
✅ REQUIRED: Use path aliases for all internal imports
✅ REQUIRED: Available aliases:
- `@schemas/*` → `src/schemas/*`
- `@services/*` → `src/services/*`
- `@stores/*` → `src/stores/*`
- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@hooks/*` → `src/hooks/*`

### Import Order
✅ REQUIRED: Group imports in this order:
1. External packages (React, MobX, MUI)
2. Internal path alias imports
3. Relative imports
4. Type imports (use `import type` when possible)

### Common Imports
✅ REQUIRED: Import types from schemas: `import { Entity } from '@schemas/entity/entity'`
✅ REQUIRED: Import services: `import { entityService } from '@services/EntityService'`
✅ REQUIRED: Import errorService: `import { errorService } from '@services/ErrorService'`
✅ REQUIRED: Import constants: `import { API_ENDPOINTS } from '@utils/constants'`

---

## 8. DATA FLOW RULES

### Unidirectional Flow
✅ REQUIRED: Follow this exact flow: API → Service → Store → Component
❌ FORBIDDEN: Skip layers (e.g., Component → Service directly)
❌ FORBIDDEN: Reverse flow (e.g., Service → Store → Service)

### Data Transformation
✅ REQUIRED: Transform data at layer boundaries:
1. API Response (JSON) → Zod Validation (Service)
2. Zod Type → MST Snapshot (Converter in Store)
3. MST Model → React Props (Component)

### State Updates
✅ REQUIRED: Update state only through MST actions
✅ REQUIRED: Use `self.property = value` in actions
❌ FORBIDDEN: Mutate state outside of actions
❌ FORBIDDEN: Mutate props in components

---

## 9. API INTEGRATION RULES

### Endpoint Management
✅ REQUIRED: Define ALL endpoints in `@utils/constants` as `API_ENDPOINTS` object
✅ REQUIRED: Use functions for dynamic IDs: `ENTITY_DETAIL: (id: number) => '/entities/${id}'`
✅ REQUIRED: Follow backend convention: `/<resource>/<version>/<path>`
❌ FORBIDDEN: Hardcode URLs in services or stores

### Request/Response
✅ REQUIRED: Type responses as `unknown` initially
✅ REQUIRED: Validate responses with Zod before returning
✅ REQUIRED: Use Zod types for request parameters
✅ REQUIRED: Handle arrays with `z.array(EntitySchema).parse(response)`

---

## 10. TESTING RULES

### Test Structure
✅ REQUIRED: Write tests alongside implementation
✅ REQUIRED: Use Vitest for unit tests
✅ REQUIRED: Use React Testing Library for component tests
✅ REQUIRED: Use MSW for API mocking

### Coverage Goals
✅ REQUIRED: Services: 90%+ coverage
✅ REQUIRED: Stores: 85%+ coverage
✅ REQUIRED: Components: 70%+ coverage
✅ REQUIRED: Utils: 95%+ coverage

---

## REFERENCE IMPLEMENTATIONS

### Primary References
- **Service Pattern**: `src/services/EntityService.ts`
- **Store Pattern**: `src/stores/models/EntityStore.ts`
- **Component Pattern**: `src/components/EntityDashboard/EntityDashboardConnector.tsx`
- **Error Handling**: `src/services/ErrorService.ts`

### Secondary References
- **AnotherEntity Service**: `src/services/AnotherEntityService.ts`
- **AnotherEntity Store**: `src/stores/models/AnotherEntity/AnotherEntityStore.ts`

### Converter Examples
- **Entity Converters**: `src/schemas/Entity/Entity.converters.ts`

### Schema Examples
- **Entity Schema**: `src/schemas/Entity/Entity.ts`

---

**Last Updated**: November 11, 2025
