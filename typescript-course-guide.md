# TypeScript Complete Course — Simple Guide

> Based on the YouTube course: https://www.youtube.com/watch?v=kvP6hDXWy88

---

## Table of Contents

1. [Setup & Tooling](#1-setup--tooling)
2. [How TypeScript Works Internally](#2-how-typescript-works-internally)
3. [Basic Types](#3-basic-types)
4. [Union, Unknown, Any & Never](#4-union-unknown-any--never)
5. [Type Narrowing & Guards](#5-type-narrowing--guards)
6. [Type Aliases & Interfaces](#6-type-aliases--interfaces)
7. [Objects & Utility Types](#7-objects--utility-types)
8. [Functions & Arrays](#8-functions--arrays)
9. [Classes](#9-classes)
10. [Generics](#10-generics)
11. [Working with Libraries](#11-working-with-libraries)
12. [TypeScript with React](#12-typescript-with-react)

---

## 1. Setup & Tooling

### Why Learn TypeScript? `[02:51]`

TypeScript catches bugs **before you run your code**. Think of it as JavaScript with a spell-checker built in.

```js
// JavaScript — bug only appears at runtime
function add(a, b) { return a + b; }
add("5", 3); // → "53" (wrong! string + number)

// TypeScript — error appears immediately in editor
function add(a: number, b: number): number { return a + b; }
add("5", 3); // ✗ Error: "5" is not a number
```

**Key benefits:**
- Autocomplete in your editor
- Catch typos and wrong types instantly
- Makes large projects easier to maintain
- Required knowledge for most professional jobs today

---

### JavaScript vs TypeScript `[04:50]`

TypeScript is just JavaScript with types added on top. All valid JavaScript is valid TypeScript.

```
JavaScript  ⊂  TypeScript
```

The TypeScript compiler removes all the type stuff and outputs plain JavaScript. So your app runs the same — you just write safer code.

---

### Writing Your First TypeScript Code `[11:18]`

```ts
// Add a colon and a type after variable names
let message: string = "Hello TypeScript";
let count: number = 42;
let isDone: boolean = false;

// Functions get types too
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

---

### Project Setup & Installation `[30:03]`

```bash
# Install TypeScript in your project
npm install -D typescript

# Generate a config file
npx tsc --init

# Compile your TypeScript files
npx tsc

# Watch mode — auto-recompiles when you save
npx tsc --watch
```

---

### The tsconfig.json File `[33:41]`

This file controls how TypeScript compiles your project.

```json
{
  "compilerOptions": {
    "target": "ES2020",     // what JS version to output
    "strict": true,         // enable all type checks (recommended)
    "outDir": "./dist",     // where compiled JS goes
    "rootDir": "./src"      // where your TS files are
  }
}
```

> **Tip:** Always turn on `"strict": true`. It enables the most useful checks.

---

## 2. How TypeScript Works Internally

> These sections explain the behind-the-scenes pipeline. You don't need to memorize this — just good to know!

### The Compiler Pipeline `[16:40]`

When you run `tsc`, your code goes through 4 stages:

```
Your .ts file
     ↓
  Scanner       → breaks code into tokens (words, symbols)
     ↓
  Parser        → builds a tree structure (AST) from tokens
     ↓
  Binder        → figures out what each name refers to
     ↓
 Type Checker   → checks types are used correctly
     ↓
  Emitter       → outputs plain .js file (types removed)
```

### Abstract Syntax Tree (AST) `[20:52]`

The parser turns your code into a tree. For example:

```ts
const add = (a: number, b: number) => a + b;
```

Becomes a tree like:
```
ArrowFunction
├── param: a (number)
├── param: b (number)
└── body: BinaryExpression (a + b)
```

### The Type Checker `[25:50]`

This is the most important part — it reads the tree and checks that you're using types correctly. Every red squiggle in your editor comes from here.

### The Emitter `[28:07]`

Strips all types and outputs JavaScript. Interfaces, type annotations — all gone. The runtime code is identical to what you'd write in plain JS.

```ts
// Input TypeScript
const user: { name: string } = { name: "Alice" };

// Output JavaScript
const user = { name: "Alice" };
```

---

## 3. Basic Types

### Type Inference vs Annotation `[43:05]`

TypeScript is smart enough to figure out types on its own most of the time.

```ts
// Inference — TypeScript figures it out
let name = "Alice";   // TypeScript knows: string
let age  = 30;        // TypeScript knows: number

// Annotation — you tell TypeScript explicitly
let city: string = "Mumbai";

// Rule of thumb:
// - Let TypeScript infer for variables
// - Always annotate function parameters
```

---

### String, Number, Boolean `[47:26]`

The three basic types. Always use **lowercase**.

```ts
let username: string  = "alice";
let score:    number  = 99.5;
let isActive: boolean = true;

// ⚠️ Don't use uppercase versions — they mean something different
let bad: String = "avoid this";  // String ≠ string
```

---

## 4. Union, Unknown, Any & Never

### Union Types `[49:33]`

A value can be one of several types. Use the `|` (pipe) symbol.

```ts
// This variable can be a string OR a number
let id: string | number;
id = "abc123";   // ✓
id = 42;         // ✓
id = true;       // ✗ Error

// In functions:
function printId(id: string | number) {
  // You must check which type it is before using type-specific methods
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // string method — safe
  } else {
    console.log(id.toFixed(2));    // number method — safe
  }
}
```

---

### The Problem with `any` `[56:03]`

`any` is a cheat code that turns off TypeScript. Avoid it.

```ts
let val: any = "hello";
val = 42;
val.toUpperCase(); // No error... but crashes at runtime!
val.foo.bar.baz;   // TypeScript just gives up checking

// ✅ Better: use 'unknown' instead
let safe: unknown = fetchSomeData();
```

---

### The `unknown` Type `[01:01:00]`

Like `any`, but safer — TypeScript forces you to check the type before using it.

```ts
let data: unknown = getUserInput();

// ✗ Can't use unknown directly
data.toUpperCase(); // Error!

// ✓ Check first, then use
if (typeof data === "string") {
  data.toUpperCase(); // Now it's safe
}
```

> **Simple rule:** Use `unknown` instead of `any` whenever you don't know the type upfront.

---

### The `never` Type `[01:35:14]`

`never` means "this can never happen." Used for:
- Functions that always throw an error
- Code that should be unreachable

```ts
// A function that never returns (always throws)
function crash(message: string): never {
  throw new Error(message);
}

// Exhaustive checking — if you add a new case and forget to handle it,
// TypeScript will give you an error here
function handleStatus(status: "active" | "inactive") {
  if (status === "active") { /* ... */ }
  else if (status === "inactive") { /* ... */ }
  else {
    const _check: never = status; // Error if a new status is added!
  }
}
```

---

### Handling Errors in Try/Catch `[01:32:25]`

In strict mode, the caught error is `unknown` — you must check it before using it.

```ts
try {
  JSON.parse("{bad json}");
} catch (err) {
  // err is 'unknown' — check it first!
  if (err instanceof Error) {
    console.error(err.message); // ✓ safe
  }
}
```

---

## 5. Type Narrowing & Guards

### Type Narrowing `[59:55]`

Narrowing means checking a type so TypeScript knows exactly what it is inside a block.

```ts
function process(val: string | number[]) {
  if (typeof val === "string") {
    val.trim();   // ✓ TypeScript knows it's a string here
  } else {
    val.sort();   // ✓ TypeScript knows it's an array here
  }
}
```

Common narrowing tools:
- `typeof` — for primitives
- `instanceof` — for classes
- `in` — check if a property exists
- Truthiness checks

---

### Custom Type Predicates `[01:10:35]`

Write your own type guard function using `is`.

```ts
interface Cat { meow(): void }
interface Dog { bark(): void }

// The return type "pet is Cat" tells TypeScript:
// "if this returns true, treat pet as a Cat"
function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}

const pet = getAnimal();
if (isCat(pet)) {
  pet.meow(); // TypeScript knows it's a Cat ✓
}
```

---

### Discriminated Unions `[01:17:45]`

The most powerful pattern for modeling different states. Add a shared `kind` or `status` field to each type.

```ts
type Result =
  | { status: "ok";    data: string }
  | { status: "error"; message: string };

function handle(result: Result) {
  // TypeScript narrows automatically based on 'status'
  if (result.status === "ok") {
    console.log(result.data);    // ✓ only available here
  } else {
    console.log(result.message); // ✓ only available here
  }
}
```

> **Use this pattern for:** API responses, Redux actions, loading states, form states.

---

### Type Assertion (`as`) `[01:23:10]`

Tell TypeScript "trust me, I know what type this is."

```ts
// TypeScript doesn't know which kind of element this is
const input = document.getElementById("name") as HTMLInputElement;
input.value = "Alice"; // ✓ now TypeScript allows .value

// ⚠️ Use sparingly — you're overriding TypeScript's safety
```

---

### Exhaustive Checks `[01:06:35]`

Make sure you handle every case in a union. If you add a new case later and forget to handle it, TypeScript will warn you.

```ts
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":  return Math.PI;
    case "square":  return 1;
    default:
      // If you add "triangle" to Shape and forget a case above,
      // this line will give you an error!
      const _: never = shape;
      return _;
  }
}
```

---

## 6. Type Aliases & Interfaces

### Type Aliases `[01:40:37]`

Give a name to any type — simple or complex.

```ts
type UserId  = string | number;
type Status  = "active" | "inactive" | "pending";
type Point   = { x: number; y: number };

// Reuse them everywhere
function getUser(id: UserId): void { /* ... */ }
function setStatus(s: Status): void { /* ... */ }
```

---

### Interfaces vs Types `[01:44:33]`

Both describe object shapes. The main practical difference:

| Feature | `interface` | `type` |
|---|---|---|
| Object shapes | ✓ | ✓ |
| Union types | ✗ | ✓ |
| Extends/merges | ✓ (can reopen) | ✗ |
| Primitives | ✗ | ✓ |

```ts
// Interface — best for objects and classes
interface User {
  name: string;
  age: number;
}

// Type — best for unions, primitives, complex combos
type StringOrNumber = string | number;
```

> **Recommendation:** Use `interface` for objects, `type` for everything else.

---

### Intersection Types `[01:51:23]`

Combine multiple types into one using `&`. The result must have all properties.

```ts
type Named = { name: string };
type Aged  = { age: number };

type Person = Named & Aged;
// Person = { name: string; age: number }

const p: Person = { name: "Alice", age: 30 }; // ✓
```

---

### Optional & Readonly Properties `[01:54:43]`

```ts
interface Config {
  readonly apiUrl: string;  // Can't change after creation
  timeout?: number;          // Optional — may be undefined
}

const config: Config = { apiUrl: "https://api.com" };
config.apiUrl = "other"; // ✗ Error — it's readonly
config.timeout;          // Type: number | undefined
```

---

## 7. Objects & Utility Types

### Duck Typing / Structural Typing `[02:04:21]`

TypeScript checks the **shape**, not the name of the type. If an object has the right properties, it's compatible.

```ts
interface Point { x: number; y: number }

function printPoint(p: Point) {
  console.log(p.x, p.y);
}

// No need to say "implements Point" — it just works!
const pos = { x: 1, y: 2, z: 3 };
printPoint(pos); // ✓ it has x and y, so it's compatible
```

---

### Built-in Utility Types `[02:11:12]`

TypeScript comes with helpful type transformers:

```ts
interface User { id: number; name: string; email: string; password: string }

// Partial — make all properties optional
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string }

// Required — make all properties required
type FullUser = Required<UserUpdate>;

// Pick — select only some properties
type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }

// Omit — exclude some properties
type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string }
```

---

## 8. Functions & Arrays

### Function Types `[02:20:42]`

```ts
// Named function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// void — for functions that don't return a value
function log(msg: string): void {
  console.log(msg);
}

// Optional parameter
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}
```

---

### Arrays `[02:30:11]`

```ts
// Two ways to type arrays (same thing)
const nums: number[]       = [1, 2, 3];
const strs: Array<string>  = ["a", "b"];

// Union arrays
const mixed: (string | number)[] = [1, "two", 3];

// Readonly arrays — can't be mutated
const locked: readonly number[] = [1, 2, 3];
locked.push(4); // ✗ Error
```

---

### Tuples `[02:36:07]`

Fixed-length arrays where each position has a specific type.

```ts
// A tuple: first element is string, second is number
type Entry = [string, number];
const item: Entry = ["apple", 1.5];

// Destructuring
const [name, price] = item;

// useState in React returns a tuple!
const [count, setCount] = useState<number>(0);
//     ↑ number          ↑ setter function
```

---

### Enums `[02:39:43]`

Named constants. String enums are clearer than numeric ones.

```ts
// String enum (recommended)
enum Direction {
  Up    = "UP",
  Down  = "DOWN",
  Left  = "LEFT",
  Right = "RIGHT"
}

const move = Direction.Up; // "UP"

// Alternative — many prefer union types over enums
type Dir = "up" | "down" | "left" | "right";
```

---

## 9. Classes

### Class Basics & Constructors `[02:47:29]`

```ts
class User {
  // Shorthand: declare AND assign properties in one step
  constructor(
    public name: string,    // accessible everywhere
    private age: number,    // only inside this class
    readonly id: number     // can't be changed after creation
  ) {}

  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

const u = new User("Alice", 30, 1);
console.log(u.name); // ✓ "Alice"
console.log(u.age);  // ✗ Error — private
```

---

### Access Modifiers `[02:52:26]`

| Modifier | Accessible From |
|---|---|
| `public` (default) | Anywhere |
| `private` | Only inside the class |
| `protected` | Inside the class + subclasses |
| `readonly` | Anywhere, but can't be changed |

---

### Getters, Setters & Static `[02:58:58]`

```ts
class Temperature {
  private _celsius = 0;

  // Getter — looks like a property, runs a function
  get fahrenheit(): number {
    return this._celsius * 9/5 + 32;
  }

  // Setter — validates before assigning
  set celsius(val: number) {
    if (val < -273.15) throw new Error("Too cold!");
    this._celsius = val;
  }
}

// Static — belongs to the class, not instances
class MathUtils {
  static readonly PI = 3.14159;
  static circleArea(r: number) { return MathUtils.PI * r * r; }
}
MathUtils.circleArea(5); // No need to create an instance
```

---

### Abstract Classes `[03:02:32]`

Blueprints that can't be used directly — subclasses must implement abstract methods.

```ts
abstract class Shape {
  abstract area(): number; // subclasses MUST implement this

  describe(): string {     // shared code for all shapes
    return `This shape has area ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(private r: number) { super(); }
  area() { return Math.PI * this.r ** 2; } // ✓ implemented
}

// new Shape(); // ✗ Can't use abstract class directly
```

---

## 10. Generics

### Why Generics? `[03:19:40]`

Generics let you write code that works with **any type** while still being safe.

```ts
// Without generics — loses type information
function first(arr: any[]): any { return arr[0]; }

// With generics — type is preserved!
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first([1, 2, 3]);   // n is number ✓
const s = first(["a", "b"]);  // s is string ✓
```

The `T` is a placeholder — TypeScript fills it in based on what you pass.

---

### Multiple Generics & Constraints `[03:22:22]`

```ts
// Multiple type parameters
function pair<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}
pair("hello", 42); // ["hello", 42] — [string, number]

// Constrained generic — T must have a .length property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest("hello", "hi");     // ✓
longest([1, 2], [3, 4, 5]); // ✓
longest(1, 2);               // ✗ number has no .length
```

---

### Generic Interfaces `[03:24:21]`

```ts
// A reusable API response wrapper
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Use it with specific types
type UserResponse  = ApiResponse<User>;
type PostsResponse = ApiResponse<Post[]>;

async function fetchUser(): Promise<ApiResponse<User>> {
  return fetch("/api/user").then(r => r.json());
}
```

---

### Interface Merging & Index Signatures `[03:16:33]`

```ts
// Index signature — object with dynamic string keys
interface Dictionary {
  [key: string]: string;
}
const colors: Dictionary = { red: "#FF0000", blue: "#0000FF" };
colors["green"] = "#00FF00"; // ✓ any string key works

// Interface merging — two declarations with same name combine
interface Window { myCustomProp: string }
interface Window { myCustomMethod(): void }
// Both merge — useful for augmenting library types
```

---

## 11. Working with Libraries

### Type Declarations (.d.ts) `[03:29:32]`

When a library isn't written in TypeScript, it needs a `.d.ts` file to describe its types.

```bash
# Many libraries include types automatically (like Axios)
npm install axios

# Others need a separate @types package
npm install -D @types/lodash
npm install -D @types/node
```

---

### Fetching Data with Axios + Types `[03:38:00]`

```ts
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

// Pass the type to axios.get<T>() — response.data is typed as User
async function getUser(id: number): Promise<User> {
  const response = await axios.get<User>(`/api/users/${id}`);
  return response.data; // TypeScript knows this is User ✓
}
```

---

### Handling Axios Errors `[03:45:00]`

```ts
import axios from "axios";

try {
  const { data } = await axios.get("/api/users");
} catch (err) {
  // Use axios.isAxiosError() as a type guard
  if (axios.isAxiosError(err)) {
    console.error(err.response?.data); // HTTP error response
    console.error(err.message);        // Error message
  } else {
    console.error("Unexpected error", err);
  }
}
```

---

### `import type` Syntax `[03:51:52]`

```ts
// import type — only the type is imported, completely removed at runtime
import type { User } from "./types";

// Regular import — may pull in runtime code too
import { User } from "./types";

// Mix — import a value AND a type from the same module
import axios, { type AxiosResponse } from "axios";
```

Use `import type` when you only need a type for annotations — it keeps your compiled JS smaller.

---

## 12. TypeScript with React

### Setting Up React + TypeScript `[03:53:45]`

```bash
# Recommended: Vite (fast)
npm create vite@latest my-app -- --template react-ts

# Alternative: Create React App
npx create-react-app my-app --template typescript
```

---

### Typing Components & Props `[03:58:27]`

```tsx
// Define your props as an interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean; // optional
}

// Annotate props directly — this is the modern approach
function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Usage
<Button label="Click me" onClick={() => console.log("clicked")} />
```

---

### Typing `useState` `[04:03:36]`

```tsx
// TypeScript infers the type from the initial value
const [count, setCount] = useState(0);        // number
const [name,  setName]  = useState("Alice");  // string

// Use a generic when starting with null or an empty array
const [user,  setUser]  = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);
```

---

### Typing Events `[04:13:08]`

```tsx
import { ChangeEvent, FormEvent } from "react";

// Input change event
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value); // the input's current text
};

// Form submit event
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // stop page reload
  const form = e.currentTarget;
  // access form fields...
};

return (
  <form onSubmit={handleSubmit}>
    <input onChange={handleChange} />
    <button type="submit">Submit</button>
  </form>
);
```

---

### `children` & `ReactNode` `[04:26:00]`

```tsx
import { ReactNode, PropsWithChildren } from "react";

// Option 1: Explicit children prop
interface CardProps {
  title: string;
  children: ReactNode; // anything React can render
}

// Option 2: Use PropsWithChildren utility
type CardProps = PropsWithChildren<{ title: string }>;

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
<Card title="Hello">
  <p>This is the child content</p>
</Card>
```

---

### Custom Hooks with Generics `[04:31:33]`

```tsx
import { useState, useEffect } from "react";

// A generic hook that fetches any type of data
function useFetch<T>(url: string) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then((d: T) => { setData(d); setLoading(false); })
      .catch((e: Error) => { setError(e); setLoading(false); });
  }, [url]);

  return { data, loading, error };
}

// Usage — T is inferred as User[]
interface User { id: number; name: string }

function UserList() {
  const { data: users, loading } = useFetch<User[]>("/api/users");

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users?.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

---

## Quick Reference Cheat Sheet

### Types at a Glance

| Type | Meaning | Example |
|---|---|---|
| `string` | Text | `"hello"` |
| `number` | Any number | `42`, `3.14` |
| `boolean` | True/false | `true` |
| `any` | Anything (avoid!) | — |
| `unknown` | Anything but safe | — |
| `never` | Impossible value | — |
| `void` | No return value | — |
| `T \| U` | Union — T or U | `string \| number` |
| `T & U` | Intersection — T and U | `Named & Aged` |
| `T[]` | Array of T | `number[]` |
| `[T, U]` | Tuple | `[string, number]` |

### Utility Types at a Glance

| Utility | What it Does |
|---|---|
| `Partial<T>` | Makes all properties optional |
| `Required<T>` | Makes all properties required |
| `Pick<T, K>` | Keep only listed properties |
| `Omit<T, K>` | Remove listed properties |
| `Readonly<T>` | Makes all properties readonly |
| `Record<K, V>` | Object with keys K and values V |

---

*Watch the full course: https://www.youtube.com/watch?v=kvP6hDXWy88*
