# TypeScript Complete Notes - Interview Ready

## Table of Contents
1. [TypeScript Basics](#typescript-basics)
2. [Type System](#type-system)
3. [Advanced Types](#advanced-types)
4. [Utility Types](#utility-types)
5. [Generics](#generics)
6. [Type Guards & Narrowing](#type-guards--narrowing)
7. [React with TypeScript](#react-with-typescript)
8. [Best Practices](#best-practices)
9. [Interview Questions](#interview-questions)

---

## TypeScript Basics

### What is TypeScript?
TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces to JavaScript.

**Key Benefits:**
- Catch errors at compile time
- Better IDE support (IntelliSense, autocomplete)
- Improved code documentation
- Easier refactoring
- Enhanced code quality and maintainability

### Basic Types

```typescript
// Primitives
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Special Types
let anything: any = "can be anything"; // Avoid using this
let unknown: unknown = "safer than any"; // Requires type checking before use
let neverReturns: never; // For functions that never return
let noValue: void = undefined; // For functions with no return value

// Type Inference
let inferred = "TypeScript knows this is a string";
```

**Key Points:**
- TypeScript infers types when possible
- Explicit typing is needed for function parameters
- `any` disables type checking - avoid it
- `unknown` is the type-safe version of `any`
- `void` is for functions that don't return anything
- `never` is for functions that never complete (infinite loops, throw errors)

### Arrays & Tuples

```typescript
// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
let mixed: (string | number)[] = [1, "two", 3];

// Readonly arrays
let immutable: readonly number[] = [1, 2, 3];
// immutable.push(4); // Error!

// Tuples - fixed length and types
let person: [string, number] = ["John", 30];
let rgb: [number, number, number] = [255, 0, 0];

// Optional tuple elements
let optional: [string, number?] = ["John"];

// Rest in tuples
let restTuple: [string, ...number[]] = ["ages", 10, 20, 30];
```

**Key Points:**
- Use `readonly` to prevent array mutations
- Tuples enforce length and type order
- Tuples are useful for fixed-structure data (coordinates, RGB values)

### Objects & Interfaces

```typescript
// Object type
let user: { name: string; age: number } = {
  name: "John",
  age: 30
};

// Interface - preferred for objects
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Cannot be modified
}

// Implementing interface
const newUser: User = {
  id: "1",
  name: "John",
  email: "john@example.com",
  createdAt: new Date()
};

// Index signatures - for dynamic keys
interface Dictionary {
  [key: string]: string;
}

const translations: Dictionary = {
  hello: "hola",
  goodbye: "adiós"
};

// Extending interfaces
interface Admin extends User {
  permissions: string[];
  role: "admin" | "superadmin";
}
```

**Key Points:**
- Use `?` for optional properties
- Use `readonly` to prevent property modification
- Interfaces can be extended
- Index signatures allow dynamic keys

### Functions

```typescript
// Function with types
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}

// Default parameters
function createUser(name: string, age: number = 18): User {
  return { id: "1", name, age };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Function type
type MathOperation = (a: number, b: number) => number;
const divide: MathOperation = (a, b) => a / b;

// Void return type
function logMessage(message: string): void {
  console.log(message);
}

// Never return type
function throwError(message: string): never {
  throw new Error(message);
}

// Function overloads
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value * 2;
}
```

**Key Points:**
- Always type function parameters and return types
- Use `void` for functions with no return
- Use `never` for functions that throw or loop infinitely
- Function overloads provide multiple call signatures

---

## Type System

### Type Aliases vs Interfaces

```typescript
// Type Alias - flexible, can represent any type
type ID = string | number;
type Point = { x: number; y: number };
type Callback = (data: string) => void;

// Interface - for object shapes
interface User {
  id: ID;
  name: string;
}

// Extending
interface Admin extends User {
  role: string;
}

type Employee = User & {
  department: string;
};

// Declaration Merging (interfaces only)
interface Window {
  customProperty: string;
}
// Later in code
interface Window {
  anotherProperty: number;
}
// Window now has both properties
```

**When to use:**
- **Interface:** Object shapes, public APIs, when extension is needed
- **Type:** Unions, intersections, primitives, complex types

### Union & Intersection Types

```typescript
// Union - OR (can be one of several types)
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

function printId(id: ID) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

// Intersection - AND (combines types)
type Draggable = { drag: () => void };
type Resizable = { resize: () => void };
type UIWidget = Draggable & Resizable;

const widget: UIWidget = {
  drag: () => console.log("dragging"),
  resize: () => console.log("resizing")
};

// Discriminated Unions (tagged unions)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "square"; size: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
  }
}
```

**Key Points:**
- Union types use `|` operator
- Intersection types use `&` operator
- Discriminated unions are type-safe with exhaustive checking
- Use type guards to narrow union types

### Type Assertions

```typescript
// Type Assertion - when you know more than TypeScript
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;

// Alternative syntax (not in JSX)
let strLength2: number = (<string>someValue).length;

// Const Assertion - creates literal types
const config = {
  api: "https://api.example.com",
  timeout: 5000
} as const;
// config is now: { readonly api: "https://api.example.com"; readonly timeout: 5000 }

// Non-null Assertion
function process(value: string | null) {
  console.log(value!.toUpperCase()); // Tell TS it's not null
}

// DOM Elements
const button = document.getElementById("btn") as HTMLButtonElement;
const input = document.querySelector("input")!; // Non-null assertion
```

**⚠️ Warning:** Use assertions sparingly. They bypass type safety.

### Enums

```typescript
// Numeric Enum
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

// String Enum (preferred)
enum Status {
  Pending = "PENDING",
  Success = "SUCCESS",
  Error = "ERROR"
}

// Const Enum - no runtime code
const enum Colors {
  Red = "#FF0000",
  Green = "#00FF00",
  Blue = "#0000FF"
}

// Better Alternative: const object
const StatusCode = {
  Pending: "PENDING",
  Success: "SUCCESS",
  Error: "ERROR"
} as const;

type StatusType = typeof StatusCode[keyof typeof StatusCode];
```

**Best Practice:** Use string enums or const objects with `as const` instead of numeric enums.

---

## Advanced Types

### Mapped Types

```typescript
// Built-in mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Custom mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// Result: { name: string | null; age: number | null }

// Remove modifiers
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Key Remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// Result: { getName: () => string; getAge: () => number }
```

### Conditional Types

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

// With infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ParameterType<T> = T extends (arg: infer P) => any ? P : never;

// Unwrap Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnwrapPromise<Promise<string>>; // string

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type ArrayUnion = ToArray<string | number>; // string[] | number[]

// Nested conditionals
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

// Flatten array type
type Flatten<T> = T extends Array<infer U> ? U : T;
type Str = Flatten<string[]>; // string
type Num = Flatten<number>;   // number

// Exclude null/undefined
type NonNullable<T> = T extends null | undefined ? never : T;
```

### Template Literal Types

```typescript
// Basic template literal
type World = "world";
type Greeting = `Hello, ${World}`; // "Hello, world"

// With unions
type Color = "red" | "blue" | "green";
type Shade = "light" | "dark";
type ColorVariant = `${Shade}-${Color}`;
// "light-red" | "light-blue" | "light-green" | "dark-red" | ...

// Event handlers
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// CSS properties
type CSSProperty = "margin" | "padding";
type Direction = "top" | "right" | "bottom" | "left";
type CSSProp = `${CSSProperty}-${Direction}`;
// "margin-top" | "margin-right" | ... | "padding-left"

// Extract route parameters
type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<Rest>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

type Params = ExtractRouteParams<"/users/:userId/posts/:postId">;
// "userId" | "postId"

// Type-safe string manipulation
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K];
};

interface User {
  name: string;
  age: number;
}

type UpperUser = UppercaseKeys<User>;
// { NAME: string; AGE: number }
```

---

## Utility Types

### Built-in Utility Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
}

// Partial<T> - makes all properties optional
type PartialUser = Partial<User>;
function updateUser(id: string, updates: Partial<User>) {
  // Can pass any subset of User properties
}

// Required<T> - makes all properties required
type RequiredUser = Required<Partial<User>>;

// Readonly<T> - makes all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick<T, K> - select specific properties
type UserPreview = Pick<User, "id" | "name" | "email">;

// Omit<T, K> - exclude specific properties
type UserWithoutPassword = Omit<User, "password">;

// Record<K, T> - create object type with specific keys
type Permissions = Record<string, boolean>;
let userPerms: Permissions = {
  canRead: true,
  canWrite: false,
  canDelete: false
};

// Exclude<T, U> - remove types from union
type AllTypes = string | number | boolean;
type StringOrNumber = Exclude<AllTypes, boolean>; // string | number

// Extract<T, U> - keep only matching types
type OnlyStrings = Extract<AllTypes, string>; // string

// NonNullable<T> - remove null and undefined
type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>; // User

// ReturnType<T> - extract function return type
function createUser() {
  return { id: "1", name: "John", age: 30 };
}
type CreatedUser = ReturnType<typeof createUser>;

// Parameters<T> - extract function parameter types
type CreateUserParams = Parameters<typeof createUser>;

// Awaited<T> - unwrap Promise type
type AwaitedUser = Awaited<Promise<User>>; // User
```

### Custom Utility Types

```typescript
// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// NonEmptyArray
type NonEmptyArray<T> = [T, ...T[]];

// ValueOf - get union of all property values
type ValueOf<T> = T[keyof T];

interface Colors {
  red: "#FF0000";
  green: "#00FF00";
  blue: "#0000FF";
}
type ColorValue = ValueOf<Colors>; // "#FF0000" | "#00FF00" | "#0000FF"

// AsyncReturnType
type AsyncReturnType<T extends (...args: any[]) => Promise<any>> =
  T extends (...args: any[]) => Promise<infer R> ? R : never;

// Prettify - flatten intersections for better display
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Writable - opposite of Readonly
type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

// PickByType - pick properties by value type
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface Example {
  name: string;
  age: number;
  isActive: boolean;
  count: number;
}

type NumberProps = PickByType<Example, number>;
// { age: number; count: number }
```

---

## Generics

### Basic Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("hello");
let output2 = identity(42); // Type inferred

// Generic with arrays
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirst([1, 2, 3]); // number | undefined
const firstName = getFirst(["a", "b"]); // string | undefined

// Generic interface
interface Box<T> {
  value: T;
}

let stringBox: Box<string> = { value: "hello" };
let numberBox: Box<number> = { value: 42 };

// Generic type alias
type Container<T> = {
  value: T;
  setValue: (value: T) => void;
};

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair("hello", 42); // [string, number]
```

### Generic Constraints

```typescript
// Extend constraint
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello"); // OK - string has length
logLength([1, 2, 3]); // OK - array has length
// logLength(42); // Error - number doesn't have length

// keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

let user = { name: "John", age: 30 };
let name = getProperty(user, "name"); // string
let age = getProperty(user, "age"); // number
// getProperty(user, "invalid"); // Error

// Using type parameters in constraints
function create<T, U extends T>(base: T, extension: U): U {
  return { ...base, ...extension };
}

// Generic with default type
interface Response<T = any> {
  data: T;
  status: number;
}

// Conditional constraint
type GetReturnType<T extends (...args: any[]) => any> = ReturnType<T>;
```

### Generic Classes

```typescript
// Generic class
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  getAll(): T[] {
    return [...this.data];
  }

  remove(item: T): void {
    this.data = this.data.filter(i => i !== item);
  }
}

const stringStore = new DataStore<string>();
stringStore.add("hello");
stringStore.add("world");

// Generic with constructor
class GenericFactory<T> {
  constructor(private creator: new () => T) {}

  create(): T {
    return new this.creator();
  }
}

// Repository pattern
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
    return null;
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async save(user: User): Promise<void> {
    // Implementation
  }

  async delete(id: string): Promise<void> {
    // Implementation
  }
}
```

---

## Type Guards & Narrowing

### Built-in Type Guards

```typescript
// typeof guard
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // value is string
  }
  return value.toFixed(2); // value is number
}

// instanceof guard
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// in operator
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// Truthiness narrowing
function printLength(str: string | null) {
  if (str) {
    console.log(str.length); // str is string
  } else {
    console.log("No string provided");
  }
}

// Equality narrowing
function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // x and y are both string
    x.toUpperCase();
    y.toUpperCase();
  }
}
```

### Custom Type Guards (Predicates)

```typescript
// Type predicate
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}

function isAdmin(user: User): user is Admin {
  return 'permissions' in user;
}

function handleUser(user: User) {
  if (isAdmin(user)) {
    console.log(user.permissions); // TypeScript knows it's Admin
  }
}

// More complex example
interface SuccessResponse {
  status: "success";
  data: any;
}

interface ErrorResponse {
  status: "error";
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.status === "success";
}

function handleResponse(response: ApiResponse) {
  if (isSuccessResponse(response)) {
    console.log(response.data); // SuccessResponse
  } else {
    console.error(response.message); // ErrorResponse
  }
}
```

### Assertion Functions

```typescript
// Assertion function
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processValue(value: unknown) {
  assertIsString(value);
  // TypeScript knows value is string here
  console.log(value.toUpperCase());
}

// Assert non-null
function assertNonNull<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
}

// Assert type guard
function assertIsUser(value: any): asserts value is User {
  if (!value || typeof value.id !== "string" || typeof value.name !== "string") {
    throw new Error("Value is not a valid User");
  }
}
```

### Discriminated Unions

```typescript
// Discriminated union (tagged union)
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Square {
  kind: "square";
  size: number;
}

type Shape = Circle | Rectangle | Square;

// Exhaustive checking
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
    default:
      // Exhaustiveness checking
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// Network state example
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  error: string;
};

type NetworkSuccessState = {
  state: "success";
  data: any;
};

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function renderStatus(status: NetworkState) {
  switch (status.state) {
    case "loading":
      return "Loading...";
    case "failed":
      return `Error: ${status.error}`;
    case "success":
      return `Data: ${JSON.stringify(status.data)}`;
  }
}
```

---

## React with TypeScript

### Component Typing

```typescript
import React from "react";

// Props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children?: React.ReactNode;
}

// Functional component
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  children
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children || label}
    </button>
  );
};

// Without React.FC (preferred)
function Button2(props: ButtonProps) {
  return <button {...props}>{props.label}</button>;
}

// Props with children explicitly
interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => (
  <div className="card">
    <h2>{title}</h2>
    {children}
  </div>
);
```

### Hooks with TypeScript

```typescript
import { useState, useEffect, useRef, useReducer, useContext } from "react";

// useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// useEffect
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch("/api/user");
    const data: User = await response.json();
    setUser(data);
  };
  fetchData();
}, []);

// useRef
const inputRef = useRef<HTMLInputElement>(null);
const timerRef = useRef<number | null>(null);

function focusInput() {
  inputRef.current?.focus();
}

// useReducer
interface State {
  count: number;
  error: string | null;
}

type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "error"; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "error":
      return { ...state, error: action.error };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, error: null });

// useContext
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### Event Handlers

```typescript
// Input events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  console.log(e.target.value);
};

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  console.log(e.target.value);
};

// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
};

// Mouse events
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.clientX, e.clientY);
};

const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
  console.log("Div clicked");
};

// Keyboard events
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    console.log("Enter pressed");
  }
};

// Focus events
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log("Input focused");
};

// Generic event handler
type EventHandler<T = HTMLElement> = (e: React.SyntheticEvent<T>) => void;
```

### Generic Components

```typescript
// Generic List component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: string;
  name: string;
}

<List<User>
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>

// Generic form field
interface FieldProps<T> {
  value: T;
  onChange: (value: T) => void;
  label: string;
}

function Field<T extends string | number>({
  value,
  onChange,
  label
}: FieldProps<T>) {
  return (
    <div>
      