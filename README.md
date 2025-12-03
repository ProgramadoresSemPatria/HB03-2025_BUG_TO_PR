# 🚀 Bug to PR Agent

Automated system that analyzes error stack traces and generates Pull Requests with fixes using Artificial Intelligence.

**Live Project: [Bug to PR](https://teste.ddnsking.com/) 🚀**

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Backend - Design Patterns](#backend---design-patterns)
- [Frontend - Design Patterns](#frontend---design-patterns)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Configuration and Execution](#configuration-and-execution)
- [API Endpoints](#api-endpoints)

---

## 🎯 Overview

**Bug to PR Agent** is a full-stack application that automates the bug fixing process. The system:

1. Receives an error stack trace from the user
2. Analyzes the repository code on GitHub in the specified branch
3. Uses AI (Gemini or OpenAI) to generate a fix patch
4. Creates a new branch and applies the patch
5. Opens a Pull Request automatically

### Workflow

```
Stack Trace → Parser → AI Analysis → Patch Generation → GitHub PR Creation
```

---

## 🏗️ Architecture

### General Architecture

The project follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │→ │ Services │→ │   API    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                    Backend (Express)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Routes   │→ │Controllers│→ │Use Cases│              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                          ↕                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Services  │  │Repository│  │Contracts │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Database (PostgreSQL + Prisma)              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend - Design Patterns

The backend was developed following **Clean Architecture** and **SOLID principles**, utilizing various design patterns:

### 1. **Factory Pattern** 🏭

**Location:** `backend/src/modules/*/factory/`

**Purpose:** Centralize controller creation, ensuring correct dependency injection.

**Example:**
```typescript
// auth.factory.ts
export function makeCreateUserController() {
  return new CreateUserController(authContainer.createUserUseCase);
}
```

**Benefits:**
- Isolation of creation logic
- Facilitates testing (mocks can be injected)
- Single Responsibility Principle

### 2. **Dependency Injection (DI) Container** 💉

**Location:** `backend/src/modules/*/di/`

**Purpose:** Manage dependencies and ensure singleton instances when necessary.

**Example:**
```typescript
// auth.container.ts
class AuthContainer {
  get repository(): IAuthContract {
    if (!this._repository) {
      this._repository = new PrismaAuthRepository(prisma);
    }
    return this._repository;
  }
  
  get createUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(
      this.repository, 
      this.hashService, 
      this.tokenEncrypter
    );
  }
}
```

**Benefits:**
- Centralized dependency control
- Lazy loading (instances created on demand)
- Facilitates maintenance and testing

### 3. **Repository Pattern** 📦

**Location:** `backend/src/modules/*/repository/`

**Purpose:** Abstract data access, allowing implementation swap without affecting business logic.

**Structure:**
```
Contract (Interface) → Repository (Implementation) → Database
```

**Example:**
```typescript
// Contract
export interface IAuthContract {
  createUser: (dto: CreateUserDto) => Promise<CreateUserResponseDto>;
  getUserByEmail: (email: string) => Promise<CreateSessionUserDto | null>;
}

// Implementation
export class PrismaAuthRepository implements IAuthContract {
  constructor(private readonly prisma: PrismaClient) {}
  // ... implementation
}
```

**Benefits:**
- Decoupling of data layer
- Facilitates testing (mocks)
- Allows swapping ORM without affecting use cases

### 4. **Use Case Pattern (Clean Architecture)** 🎯

**Location:** `backend/src/modules/*/use-cases/`

**Purpose:** Encapsulate business rules in specific use cases.

**Characteristics:**
- Each use case has a single responsibility
- Receives DTOs as input
- Returns `Either<Error, Success>` (Functional Error Handling)
- Doesn't know implementation details (HTTP, Database, etc)

**Example:**
```typescript
export class CreateUserUseCase {
  constructor(
    private readonly authContract: IAuthContract,
    private readonly hashGenerator: HashGenerator,
    private readonly tokenEncrypter: TokenEncrypter
  ) {}

  async execute(dto: CreateUserDto): Promise<Either<UserAlreadyExistsError, CreateUserResponseDto>> {
    // Pure business logic
  }
}
```

**Benefits:**
- Testability
- Reusability
- Maintainability

### 5. **Strategy Pattern** 🎨

**Location:** `backend/src/modules/bug-to-pr/strategies/`

**Purpose:** Allow swapping algorithms (AI providers) at runtime.

**Structure:**
```
IAIStrategy (Interface)
  ├── GeminiStrategy
  ├── OpenAIStrategy
  └── MockStrategy (for tests)
```

**Example:**
```typescript
// Factory that chooses the strategy
export class AIStrategyFactory {
  static create(provider?: AIProvider): IAIStrategy {
    switch (provider || env.AI_PROVIDER) {
      case 'gemini': return new GeminiStrategy(env.GEMINI_API_KEY);
      case 'openai': return new OpenAIStrategy(env.OPENAI_API_KEY);
    }
  }
}

// Usage in Service
const strategy = AIStrategyFactory.create(dto.aiProvider);
const aiService = new AIService(strategy);
```

**Benefits:**
- Extensibility (easy to add new providers)
- Open/Closed Principle
- Testability

### 6. **Contract Pattern (Interface Segregation)** 📋

**Location:** `backend/src/modules/*/contract/`

**Purpose:** Define clear contracts between layers, following Interface Segregation Principle.

**Example:**
```typescript
export interface IGithubService {
  getFileContent(...): Promise<GitHubFileContent>;
  createBranch(...): Promise<void>;
  getUserRepositories(...): Promise<GitHubRepositoryDto[]>;
  // ... specific methods
}
```

**Benefits:**
- Decoupling
- Testability (mocks)
- Implicit documentation

### 7. **Either Pattern (Functional Error Handling)** ⚖️

**Location:** `backend/src/@types/either.ts`

**Purpose:** Handle errors functionally, without exceptions.

**Structure:**
```typescript
type Either<L, R> = Left<L, R> | Right<L, R>

// Left = Error
// Right = Success
```

**Example:**
```typescript
async execute(dto: Dto): Promise<Either<GithubError, SuccessDto>> {
  if (error) {
    return left(new GithubError(400));
  }
  return right(successData);
}

// Usage in Controller
if (result.isLeft()) {
  return response.status(result.value.statusCode).json({
    error: result.value.message
  });
}
```

**Benefits:**
- Explicit errors in type
- Forces error handling
- More predictable code

### 8. **DTO Pattern (Data Transfer Object)** 📤

**Location:** `backend/src/modules/*/dto/`

**Purpose:** Transfer data between layers in a typed and validated way.

**Example:**
```typescript
export interface GeneratePRDto {
  stackTrace: string;
  owner: string;
  repo: string;
  branch: string;
  userId?: string;
  aiProvider?: 'gemini' | 'openai';
}
```

**Benefits:**
- Type safety
- Centralized validation
- Documentation

### 9. **Middleware Pattern** 🔒

**Location:** `backend/src/modules/auth/middleware/`

**Purpose:** Intercept requests for authentication/authorization.

**Example:**
```typescript
export const authenticate = (req, res, next) => {
  // Validates JWT token
  // Injects user into request
  next();
}
```

### 10. **Validator Pattern (Zod)** ✅

**Location:** `backend/src/modules/*/validator/` and `backend/src/shared/zod-validator.middleware.ts`

**Purpose:** Validate input data using Zod schemas.

**Example:**
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Middleware
export const validate = (schema: ZodSchema) => {
  return (req, res, next) => {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  };
};
```

---

## 🎨 Frontend - Design Patterns

The frontend was developed following **Component-Based Architecture** and **Separation of Concerns**:

### 1. **Service Layer Pattern** 🔌

**Location:** `frontend/src/services/`

**Purpose:** Abstract API communication, centralizing HTTP logic.

**Structure:**
```
ApiClient (base) → Services (specific) → Components
```

**Example:**
```typescript
// api.ts - Base client
class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit) {
    // Centralized HTTP logic
    // JWT injection
    // Error handling
  }
}

// auth.ts - Specific service
class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post("/auth/sessions", credentials);
    // Data transformation
    return mappedUser;
  }
}
```

**Benefits:**
- Reusability
- Maintainability
- Testability

### 2. **Custom Hooks Pattern** 🎣

**Location:** `frontend/src/hooks/`

**Purpose:** Encapsulate state logic and side effects.

**Examples:**
- `useRepositories()` - Manages GitHub repositories state
- `useAnalysis()` - Manages stack trace analysis flow
- `useLocalStorage()` - Abstracts localStorage
- `useScroll()` - Manages scroll behavior

**Example:**
```typescript
export function useRepositories() {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch logic, grouping, etc.
  
  return { repositories, owners, repositoriesByOwner, isLoading, refetch };
}
```

**Benefits:**
- Logic reusability
- Separation of concerns
- Testability

### 3. **Component Composition Pattern** 🧩

**Location:** `frontend/src/components/`

**Structure:**
```
shared/          → Reusable components (Header, Footer, AuthGuard)
features/        → Feature-specific components
  ├── analysis/  → Analysis-related components
  ├── hero/      → Landing page components
  └── home/      → Home components
ui/              → Base components (Button, Input, Card)
```

**Example:**
```typescript
// Component composition
<AuthGuard>
  <Header variant="app" />
  <AnalysisForm />
  <Footer />
</AuthGuard>
```

**Benefits:**
- Reusability
- Maintainability
- Isolated testability

### 4. **Auth Guard Pattern** 🛡️

**Location:** `frontend/src/components/shared/auth-guard.tsx`

**Purpose:** Protect routes that require authentication.

**Example:**
```typescript
export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    router.push(ROUTES.LOGIN);
    return null;
  }
  
  return <>{children}</>;
}
```

**Usage:**
```typescript
<AuthGuard>
  <DashboardPage />
</AuthGuard>
```

### 5. **Validator Pattern (Zod)** ✅

**Location:** `frontend/src/validators/`

**Purpose:** Validate forms on the frontend, mirroring backend validations.

**Example:**
```typescript
export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  githubToken: z.string().min(1, "GitHub Token is required"),
});
```

**Benefits:**
- Consistent frontend/backend validation
- Type safety
- Standardized error messages

### 6. **Type System (TypeScript)** 📝

**Location:** `frontend/src/types/`

**Purpose:** Centralize type definitions.

**Structure:**
```
types/
  ├── auth.ts
  ├── analysis.ts
  ├── api.ts
  ├── repositories.ts
  └── index.ts (barrel export)
```

**Benefits:**
- Type safety
- Autocomplete
- Documentation

### 7. **Constants Pattern** 📌

**Location:** `frontend/src/constants/`

**Purpose:** Centralize constant values (routes, configurations).

**Example:**
```typescript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  HISTORY: "/history",
} as const;
```

### 8. **Feature-Based Organization** 📁

**Structure:**
```
features/
  analysis/
    ├── analysis-form.tsx
    ├── history-list.tsx
    ├── pr-result.tsx
    └── index.ts
```

**Benefits:**
- Domain-based organization
- Facilitates code location
- Scalability

---

## 📂 Project Structure

### Backend

```
backend/
├── src/
│   ├── @types/              # Custom types (Either)
│   ├── config/              # Configurations (env)
│   ├── models/              # Prisma Client
│   ├── modules/             # Application modules
│   │   ├── auth/            # Authentication module
│   │   │   ├── contract/    # Interfaces
│   │   │   ├── controllers/ # HTTP Controllers
│   │   │   ├── cryptography/# Cryptography (JWT, AES)
│   │   │   ├── di/          # Dependency Injection
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── errors/      # Custom errors
│   │   │   ├── factory/     # Factory Pattern
│   │   │   ├── middleware/  # Express Middleware
│   │   │   ├── repository/  # Repository Pattern
│   │   │   ├── routes/      # Express Routes
│   │   │   ├── use-cases/   # Business Logic
│   │   │   └── validator/   # Zod Schemas
│   │   └── bug-to-pr/       # Main module
│   │       ├── constants/   # Constants
│   │       ├── contract/     # Interfaces
│   │       ├── controllers/  # HTTP Controllers
│   │       ├── di/          # Dependency Injection
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── errors/      # Custom errors
│   │       ├── factory/     # Factory Pattern
│   │       ├── repository/  # Repository Pattern
│   │       ├── routes/      # Express Routes
│   │       ├── services/    # Domain Services
│   │       ├── strategies/  # Strategy Pattern (AI)
│   │       ├── use-cases/   # Business Logic
│   │       ├── utils/       # Utilities
│   │       └── validator/   # Zod Schemas
│   ├── routes/              # Route binding
│   ├── shared/              # Shared code
│   └── server.ts            # Entry point
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

### Frontend

```
frontend/
├── app/                     # Next.js App Router
│   ├── dashboard/           # Dashboard page
│   ├── history/             # History page
│   ├── login/               # Login page
│   └── page.tsx             # Landing page
├── src/
│   ├── components/          # React Components
│   │   ├── features/        # Feature components
│   │   ├── shared/          # Shared components
│   │   └── ui/              # Base components (shadcn)
│   ├── config/              # Configurations
│   ├── constants/           # Constants
│   ├── hooks/               # Custom Hooks
│   ├── lib/                 # Utilities
│   ├── services/            # API Services
│   ├── types/               # TypeScript Types
│   └── validators/          # Zod Validators
└── package.json
```

---

## 🛠️ Technologies

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Validation:** Zod
- **Authentication:** JWT (jsonwebtoken)
- **Cryptography:** bcryptjs, AES (token encryption)
- **AI Providers:** 
  - Google Gemini (@google/generative-ai)
  - OpenAI (openai)
- **GitHub API:** @octokit/rest
- **Testing:** Vitest
- **Code Quality:** TypeScript strict mode

### Frontend

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI (Radix UI)
- **Icons:** Lucide React
- **Animations:** Framer Motion, GSAP
- **Forms:** React (controlled components)
- **Validation:** Zod
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **HTTP Client:** Fetch API (custom ApiClient)
- **Notifications:** Sonner
- **Theming:** next-themes (dark mode)

---

## ⚙️ Configuration and Execution

### Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm (or npm/yarn)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Configure database
npm run prisma:generate
npm run prisma:migrate

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment variables
# Create .env.local with NEXT_PUBLIC_API_URL

# Run in development
pnpm dev

# Build for production
pnpm build
pnpm start
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ENCRYPTION_KEY=your-32-char-encryption-key
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/auth/users` - Create user
- `POST /api/v1/auth/sessions` - Login

### Bug to PR

- `POST /api/v1/bug-to-pr/generate` - Generate PR from stack trace
- `GET /api/v1/bug-to-pr/repositories` - List user repositories
- `GET /api/v1/bug-to-pr/history` - History of generated PRs

### Health Check

- `GET /api/v1/health` - Server status

---

## 🎓 Applied Principles

### SOLID

- **S**ingle Responsibility: Each class/component has one responsibility
- **O**pen/Closed: Extensible via Strategy Pattern
- **L**iskov Substitution: Well-defined interfaces
- **I**nterface Segregation: Specific contracts
- **D**ependency Inversion: Dependencies via interfaces

### Clean Architecture

- **Well-defined layers:** Controllers → Use Cases → Services/Repository
- **Framework independence:** Business logic doesn't depend on Express
- **Testability:** Easy to create mocks and unit tests
- **UI independence:** Use cases don't know about HTTP

### DRY (Don't Repeat Yourself)

- Shared validations (Zod schemas)
- Reusable services
- Custom hooks
- Composed components

---

## 📝 Development Notes

### Architectural Decisions

1. **Either Pattern:** Chosen for functional error handling, avoiding unhandled exceptions
2. **Repository Pattern:** Allows swapping ORM without affecting business logic
3. **Strategy Pattern for AI:** Facilitates adding new AI providers
4. **DI Containers:** Centralizes dependencies, facilitates testing
5. **Zod in Frontend and Backend:** Ensures consistent validation

---

## 📄 License

ISC

---

## 👥 Authors

Gabriel Melo, Lucas Nery, Luiz Renan and Eduardo Zago
Project developed for Hackathon Base 2025.
