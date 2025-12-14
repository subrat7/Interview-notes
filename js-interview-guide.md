# Advanced JavaScript Interview Guide - 54 Core Concepts

## 1. Scope in JavaScript (Global, Functional, Block)

**Scope** determines the accessibility and lifetime of variables in your code.

### Global Scope
Variables declared outside any function or block are in the global scope. In browsers, they become properties of the `window` object.

```javascript
var globalVar = "I'm global";
let globalLet = "Also global";

function test() {
  console.log(globalVar); // Accessible
}
```

### Function Scope
Variables declared with `var` inside a function are function-scoped. They're accessible anywhere within that function but not outside.

```javascript
function myFunction() {
  var functionScoped = "Only inside function";
  if (true) {
    var stillFunctionScoped = "Still accessible";
  }
  console.log(stillFunctionScoped); // Works
}
```

### Block Scope
Introduced with ES6 (`let` and `const`), block scope confines variables to the block `{}` where they're declared.

```javascript
if (true) {
  let blockScoped = "Only in this block";
  const alsoBlockScoped = "Me too";
  var notBlockScoped = "I'm function/global scoped";
}
// blockScoped and alsoBlockScoped are NOT accessible here
// notBlockScoped IS accessible
```

**Interview Insight**: Understanding scope is fundamental to preventing variable collisions, memory leaks, and writing maintainable code. Senior developers should explain how scope affects closure creation and module patterns.

---

## 2. Scope Chaining

**Scope chain** is the mechanism JavaScript uses to resolve variable names. When a variable is referenced, JavaScript looks in the current scope, then moves up through parent scopes until it finds the variable or reaches the global scope.

```javascript
const global = "global";

function outer() {
  const outerVar = "outer";
  
  function inner() {
    const innerVar = "inner";
    console.log(innerVar);   // Found in inner scope
    console.log(outerVar);   // Found in outer scope (via scope chain)
    console.log(global);     // Found in global scope (via scope chain)
  }
  
  inner();
}
```

**Key Points**:
- Each function creates a new scope that links to its parent scope
- The chain is determined at **function definition time** (lexical scoping), not at runtime
- If a variable isn't found in the entire chain, a `ReferenceError` is thrown

**Performance Consideration**: Deeply nested scope chains can impact performance. Variables in outer scopes require more lookups.

---

## 3. Primitive vs Non-Primitive in JavaScript

### Primitives (Immutable, Pass by Value)
- **String**: `"hello"`
- **Number**: `42`, `3.14`
- **BigInt**: `9007199254740991n`
- **Boolean**: `true`, `false`
- **Undefined**: `undefined`
- **Null**: `null`
- **Symbol**: `Symbol('description')`

```javascript
let a = 10;
let b = a;  // Copies the VALUE
b = 20;
console.log(a); // 10 (unchanged)
```

### Non-Primitives (Mutable, Pass by Reference)
- **Object**: `{}`, `[]`, `function() {}`
- **Array**: `[1, 2, 3]`
- **Function**: `function() {}`
- **Date**, **RegExp**, etc.

```javascript
let obj1 = { value: 10 };
let obj2 = obj1;  // Copies the REFERENCE
obj2.value = 20;
console.log(obj1.value); // 20 (changed!)
```

**Memory Storage**:
- Primitives are stored directly in the **stack**
- Objects are stored in the **heap**, with references stored in the stack

---

## 4. Var, Let, and Const

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function | Block | Block |
| Hoisting | Yes (initialized with undefined) | Yes (but in TDZ) | Yes (but in TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed* |
| Global object property | Yes | No | No |

*For const, the binding is immutable, but object properties can be modified.

```javascript
// var - function scoped
function varTest() {
  var x = 1;
  if (true) {
    var x = 2;  // Same variable!
    console.log(x);  // 2
  }
  console.log(x);  // 2
}

// let - block scoped
function letTest() {
  let x = 1;
  if (true) {
    let x = 2;  // Different variable
    console.log(x);  // 2
  }
  console.log(x);  // 1
}

// const - must be initialized, binding is immutable
const obj = { value: 1 };
// obj = {}; // Error!
obj.value = 2; // Allowed
```

**Best Practice**: Always use `const` by default. Use `let` only when you need reassignment. Avoid `var` in modern code.

---

## 5. Temporal Dead Zone (TDZ)

The **TDZ** is the period between entering scope and the variable declaration being executed. During this time, accessing the variable throws a `ReferenceError`.

```javascript
console.log(varVariable);   // undefined (hoisted)
console.log(letVariable);   // ReferenceError: Cannot access before initialization

var varVariable = "var";
let letVariable = "let";
```

```javascript
function example() {
  // TDZ starts for 'x'
  
  console.log(x); // ReferenceError
  
  let x = 10; // TDZ ends
  
  console.log(x); // 10
}
```

**Why TDZ exists**: It helps catch programming errors. If you're using a variable before declaring it, it's likely a mistake.

**Interview Insight**: Explain that hoisting still occurs with `let` and `const`, but they remain uninitialized in the TDZ, unlike `var` which is initialized with `undefined`.

---

## 6. Hoisting

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope before code execution.

### Function Declarations (Fully Hoisted)
```javascript
sayHello(); // Works!

function sayHello() {
  console.log("Hello");
}
```

### Variable Declarations (Only declaration hoisted, not initialization)
```javascript
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Interpreted as:
// var x;
// console.log(x);
// x = 5;
```

### Let/Const (Hoisted but in TDZ)
```javascript
console.log(y); // ReferenceError
let y = 10;
```

### Function Expressions (Not hoisted as functions)
```javascript
sayHi(); // TypeError: sayHi is not a function

var sayHi = function() {
  console.log("Hi");
};
```

### Class Declarations (Not hoisted)
```javascript
const obj = new MyClass(); // ReferenceError

class MyClass {}
```

---

## 7. Prototypes in JavaScript

**Prototypes** are the mechanism by which JavaScript objects inherit features from one another. Every JavaScript object has an internal `[[Prototype]]` property that references another object.

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const john = new Person("John");
john.greet(); // "Hello, I'm John"
```

**Key Concepts**:
- Every function has a `prototype` property (an object)
- When you create an object with `new`, the object's `[[Prototype]]` links to the constructor's `prototype`
- Access via `Object.getPrototypeOf(obj)` or `obj.__proto__` (deprecated)

---

## 8. Prototype Object

The **prototype object** is a regular object that serves as a template for other objects. It contains properties and methods that should be shared across all instances.

```javascript
function Car(brand) {
  this.brand = brand;
}

// Adding methods to prototype (shared across instances)
Car.prototype.start = function() {
  console.log(`${this.brand} is starting`);
};

Car.prototype.wheels = 4; // Shared property

const tesla = new Car("Tesla");
const bmw = new Car("BMW");

tesla.start(); // "Tesla is starting"
console.log(tesla.wheels); // 4
console.log(bmw.wheels);   // 4

// Modifying prototype affects all instances
Car.prototype.wheels = 6;
console.log(tesla.wheels); // 6
console.log(bmw.wheels);   // 6
```

**Memory Efficiency**: Methods defined on the prototype are shared, not duplicated for each instance.

---

## 9. Prototype Chaining

**Prototype chaining** is how JavaScript implements inheritance. When accessing a property, JavaScript looks at the object, then its prototype, then the prototype's prototype, etc., until it finds the property or reaches `null`.

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} is barking`);
};

const dog = new Dog("Buddy", "Golden Retriever");

dog.bark(); // Own method
dog.eat();  // Inherited from Animal via prototype chain

// Lookup chain: dog -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
```

**ES6 Class Syntax** (syntactic sugar over prototypes):
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} is barking`);
  }
}
```

---

## 10. Closures

A **closure** is a function that has access to variables from its outer (enclosing) lexical scope, even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
console.log(counter.count);       // undefined (private)
```

**Common Use Cases**:
1. **Data Privacy/Encapsulation**: Creating private variables
2. **Event Handlers**: Preserving state
3. **Callbacks**: Maintaining context
4. **Partial Application**: Creating specialized functions

**Memory Consideration**: Closures keep references to outer variables, preventing garbage collection. Be mindful of memory leaks with long-lived closures.

```javascript
// Memory leak example
function addHandlers() {
  const largeData = new Array(1000000).fill('data');
  
  document.getElementById('btn').addEventListener('click', function() {
    console.log('Clicked');
    // largeData is kept in memory even if not used!
  });
}
```

---

## 11. Pass by Reference vs Pass by Value

JavaScript is **always pass-by-value**, but the "value" for objects is a reference.

### Primitives (Pass by Value)
```javascript
function modifyPrimitive(x) {
  x = 100;
}

let num = 50;
modifyPrimitive(num);
console.log(num); // 50 (unchanged)
```

### Objects (Pass by "Reference Value")
```javascript
function modifyObject(obj) {
  obj.value = 100;  // Modifies the original object
}

function reassignObject(obj) {
  obj = { value: 200 };  // Only changes local reference
}

let myObj = { value: 50 };

modifyObject(myObj);
console.log(myObj.value); // 100 (changed)

reassignObject(myObj);
console.log(myObj.value); // 100 (unchanged - reassignment doesn't affect original)
```

**Key Insight**: You're passing a copy of the reference, not the reference itself. This is why reassigning the parameter doesn't affect the original variable.

---

## 12. Currying in JavaScript

**Currying** transforms a function with multiple arguments into a sequence of functions, each taking a single argument.

```javascript
// Normal function
function add(a, b, c) {
  return a + b + c;
}

// Curried version
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

// ES6 arrow function syntax
const curriedAddArrow = a => b => c => a + b + c;
```

**Generic Curry Function**:
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));     // 6
console.log(curriedSum(1, 2)(3));     // 6
console.log(curriedSum(1)(2, 3));     // 6
```

**Benefits**:
- **Reusability**: Create specialized functions
- **Composition**: Easier function composition
- **Partial Application**: Fix some arguments

---

## 13. Infinite Currying Problem

Implement a function that can be called indefinitely and returns the sum when invoked without arguments.

```javascript
function add(a) {
  return function(b) {
    if (b !== undefined) {
      return add(a + b);
    }
    return a;
  };
}

console.log(add(1)(2)(3)(4)()); // 10
console.log(add(5)(10)()); // 15
```

**Alternative with valueOf**:
```javascript
function add(a) {
  let sum = a;
  
  function inner(b) {
    sum += b;
    return inner;
  }
  
  inner.valueOf = function() {
    return sum;
  };
  
  return inner;
}

console.log(+add(1)(2)(3)(4)); // 10
```

**With toString**:
```javascript
function add(a) {
  let sum = a;
  
  function inner(b) {
    if (b === undefined) return sum;
    sum += b;
    return inner;
  }
  
  inner.toString = function() {
    return sum;
  };
  
  return inner;
}

console.log(String(add(1)(2)(3))); // "6"
```

---

## 14. Memoization in JavaScript

**Memoization** is an optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again.

```javascript
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Fetching from cache');
      return cache[key];
    }
    
    console.log('Calculating result');
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

// Example: Expensive Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log(memoizedFib(40)); // Calculating result
console.log(memoizedFib(40)); // Fetching from cache (instant)
```

**Advanced Memoization with WeakMap** (for object arguments):
```javascript
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = args[0];
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

**Use Cases**:
- Recursive calculations (Fibonacci, factorial)
- API calls with repeated parameters
- Complex computations in rendering

---

## 15. Rest Parameter

The **rest parameter** syntax allows representing an indefinite number of arguments as an array.

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
```

**Key Points**:
- Must be the **last parameter**
- Only **one** rest parameter per function
- Creates a **real array** (not array-like object like `arguments`)

```javascript
function logDetails(firstName, lastName, ...hobbies) {
  console.log(firstName);  // "John"
  console.log(lastName);   // "Doe"
  console.log(hobbies);    // ["reading", "coding", "gaming"]
}

logDetails("John", "Doe", "reading", "coding", "gaming");
```

**Rest vs Arguments**:
```javascript
function oldWay() {
  const args = Array.from(arguments); // or [...arguments]
  console.log(args);
}

function newWay(...args) {
  console.log(args); // Already an array
}
```

---

## 16. Spread Operator

The **spread operator** expands an iterable (array, string, object) into individual elements.

### Array Spreading
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copying arrays
const copy = [...arr1]; // Shallow copy

// Passing array elements as arguments
Math.max(...arr1); // 3
```

### Object Spreading (ES2018)
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Overriding properties
const updated = { ...obj1, b: 10 }; // { a: 1, b: 10 }

// Shallow copy
const objCopy = { ...obj1 };
```

### String Spreading
```javascript
const str = "hello";
const chars = [...str]; // ["h", "e", "l", "l", "o"]
```

**Common Use Cases**:
- Cloning arrays/objects (shallow)
- Merging arrays/objects
- Converting iterables to arrays
- Function arguments

---

## 17. How Many Ways to Create Objects in JavaScript

### 1. Object Literal
```javascript
const obj = {
  name: "John",
  age: 30
};
```

### 2. Constructor Function
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person = new Person("John", 30);
```

### 3. Object.create()
```javascript
const proto = {
  greet() {
    console.log("Hello");
  }
};

const obj = Object.create(proto);
obj.name = "John";
```

### 4. ES6 Class
```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person("John", 30);
```

### 5. Factory Function
```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hello, I'm ${this.name}`);
    }
  };
}

const person = createPerson("John", 30);
```

### 6. Object Constructor
```javascript
const obj = new Object();
obj.name = "John";
obj.age = 30;
```

### 7. Object.assign()
```javascript
const obj = Object.assign({}, { name: "John" }, { age: 30 });
```

### 8. Singleton Pattern
```javascript
const singleton = (function() {
  let instance;
  
  function createInstance() {
    return { name: "Singleton" };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
```

---

## 18. Generator Functions in JavaScript

**Generator functions** are special functions that can pause execution and resume later, yielding multiple values over time.

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

**Infinite Generator**:
```javascript
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const seq = infiniteSequence();
console.log(seq.next().value); // 0
console.log(seq.next().value); // 1
console.log(seq.next().value); // 2
```

**Practical Example - Custom Iterator**:
```javascript
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

for (const num of range(0, 10, 2)) {
  console.log(num); // 0, 2, 4, 6, 8
}
```

**Delegating Generators**:
```javascript
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield* gen1(); // Delegate to gen1
  yield 3;
}

const gen = gen2();
console.log([...gen]); // [1, 2, 3]
```

**Use Cases**:
- Lazy evaluation
- Infinite sequences
- Custom iterators
- Async flow control (with libraries)

---

## 19. JavaScript Single-Threaded Language

JavaScript is **single-threaded**, meaning it executes one task at a time in a single call stack. However, it can handle asynchronous operations through the **event loop**.

**Why Single-Threaded?**
- Originally designed for simple browser interactions
- Avoids complexity of multi-threading (race conditions, deadlocks)
- Simplifies the programming model

**How Asynchronicity Works**:
JavaScript uses:
1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Handle async operations (setTimeout, fetch, DOM events)
3. **Callback Queue**: Stores callbacks from completed async operations
4. **Event Loop**: Moves callbacks from queue to call stack when stack is empty

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");

// Output:
// Start
// End
// Promise
// Timeout
```

**Concurrency Model**: JavaScript achieves concurrency through asynchronous callbacks, not parallel execution.

---

## 20. Callbacks - Why We Need Them

**Callbacks** are functions passed as arguments to other functions, executed after an operation completes.

### Why Callbacks?
1. **Asynchronous Operations**: Handle operations that take time (I/O, network requests)
2. **Non-Blocking Code**: Continue execution while waiting
3. **Event Handling**: Respond to user actions

```javascript
// Synchronous (blocking)
function syncOperation() {
  // Blocks for 5 seconds
  const end = Date.now() + 5000;
  while (Date.now() < end) {}
  return "Done";
}

// Asynchronous (non-blocking)
function asyncOperation(callback) {
  setTimeout(() => {
    callback("Done");
  }, 5000);
}

asyncOperation((result) => {
  console.log(result); // Executes after 5 seconds
});

console.log("This runs immediately");
```

**Real-World Example**:
```javascript
// Reading file (Node.js style)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

// Event listener
button.addEventListener('click', (event) => {
  console.log('Button clicked');
});
```

---

## 21. Event Loop

The **event loop** is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.

### How It Works:

1. **Call Stack**: Executes functions (LIFO)
2. **Web APIs**: Browser/Node.js APIs handle async operations
3. **Callback Queue** (Task Queue): FIFO queue for callbacks
4. **Microtask Queue**: Higher priority queue for promises
5. **Event Loop**: Continuously checks if call stack is empty, then pushes tasks

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
```

**Execution Order**:
1. Execute all synchronous code (Call Stack)
2. Execute all Microtasks (Promises)
3. Execute one Macrotask (setTimeout, setInterval)
4. Repeat

**Visualization**:
```
Call Stack
    ↓
  Empty?
    ↓
Microtask Queue (Process ALL)
    ↓
Macrotask Queue (Process ONE)
    ↓
Render (if browser)
    ↓
Repeat
```

---

## 22. Callback Queue (Task Queue / Macrotask Queue)

The **callback queue** holds callbacks from async operations like `setTimeout`, `setInterval`, and I/O operations.

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');

// Output:
// Start
// End
// Timeout 1
// Timeout 2
```

**Macrotasks include**:
- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- I/O operations
- UI rendering

**Key Point**: Event loop processes **one macrotask** per iteration, then processes all microtasks before the next macrotask.

---

## 23. Microtask Queue

The **microtask queue** has higher priority than the callback queue. It holds:
- Promise callbacks (`.then`, `.catch`, `.finally`)
- `queueMicrotask()`
- `MutationObserver` callbacks

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');

// Output: 1, 5, 3, 4, 2
```

**Microtask Priority**:
All microtasks are processed **before** the next macrotask, even if the microtask queue keeps getting new tasks.

```javascript
setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
  Promise.resolve().then(() => {
    console.log('Promise 2');
  });
});

// Output:
// Promise 1
// Promise 2
// Timeout
```

---

## 24. Promises

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation.

### States:
1. **Pending**: Initial state
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("Success!");
    } else {
      reject("Error!");
    }
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Cleanup"));
```

**Chaining**:
```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data.id;
  })
  .then(id => fetch(`https://api.example.com/details/${id}`))
  .then(response => response.json())
  .catch(error => console.error('Error:', error));
```

**Promise Methods**:

```javascript
// Promise.all - All must resolve
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results));

// Promise.race - First to settle wins
Promise.race([promise1, promise2])
  .then(result => console.log(result));

// Promise.allSettled - Wait for all (ES2020)
Promise.allSettled([promise1, promise2])
  .then(results => console.log(results));

// Promise.any - First to fulfill (ES2021)
Promise.any([promise1, promise2])
  .then(result => console.log(result));
```

---

## 25. Event Propagation

**Event propagation** is the flow of events through the DOM tree. It has three phases:

1. **Capturing Phase**: Event travels from root to target
2. **Target Phase**: Event reaches target element
3. **Bubbling Phase**: Event bubbles up from target to root

```html
<div id="outer">
  <div id="middle">
    <button id="inner">Click Me</button>
  </div>
</div>
```

```javascript
const outer = document.getElementById('outer');
const middle = document.getElementById('middle');
const inner = document.getElementById('inner');

outer.addEventListener('click', () => console.log('Outer'), true);  // Capture
middle.addEventListener('click', () => console.log('Middle'), true); // Capture
inner.addEventListener('click', () => console.log('Inner'));        // Bubble

outer.addEventListener('click', () => console.log('Outer Bubble'));
middle.addEventListener('click', () => console.log('Middle Bubble'));

// Clicking inner button outputs:
// Outer (capture)
// Middle (capture)
// Inner
// Middle Bubble
// Outer Bubble
```

---

## 26. Event Bubbling

**Event bubbling** is when an event propagates from the target element up through its ancestors to the root.

```javascript
document.getElementById('child').addEventListener('click', function(e) {
  console.log('Child clicked');
});

document.getElementById('parent').addEventListener('click', function(e) {
  console.log('Parent clicked');
});

document.body.addEventListener('click', function(e) {
  console.log('Body clicked');
});

// Clicking child outputs:
// Child clicked
// Parent clicked
// Body clicked
```

**Default Behavior**: Most events bubble by default (except `focus`, `blur`, `load`, `scroll`).

---

## 27. Event Capturing (Trickling)

**Event capturing** is the opposite of bubbling - the event travels from the root down to the target element.

```javascript
// Enable capturing by setting third parameter to true
element.addEventListener('click', handler, true);

document.body.addEventListener('click', () => {
  console.log('Body - Capture');
}, true);

document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent - Capture');
}, true);

document.getElementById('child').addEventListener('click', () => {
  console.log('Child - Capture');
}, true);

// Clicking child outputs:
// Body - Capture
// Parent - Capture
// Child - Capture
```

---

## 28. Event Stop Propagation

**stopPropagation()** prevents the event from bubbling up or capturing down the DOM tree.

```javascript
document.getElementById('child').addEventListener('click', function(e) {
  console.log('Child clicked');
  e.stopPropagation(); // Stops propagation
});

document.getElementById('parent').addEventListener('click', function(e) {
  console.log('Parent clicked'); // Won't execute
});

// Only outputs: Child clicked
```

**stopImmediatePropagation()**:
Prevents other listeners on the same element from executing.

```javascript
element.addEventListener('click', function(e) {
  console.log('First listener');
  e.stopImmediatePropagation();
});

element.addEventListener('click', function(e) {
  console.log('Second listener'); // Won't execute
});
```

**preventDefault()**: Prevents default browser behavior (different from stopPropagation).

```javascript
link.addEventListener('click', function(e) {
  e.preventDefault(); // Prevents navigation
  console.log('Link clicked but not followed');
});
```

---

## 29. Event Delegation

**Event delegation** leverages event bubbling to handle events at a higher level rather than attaching listeners to each child element.

```javascript
// Bad: Attaching listener to each item
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// Good: Single listener on parent
document.getElementById('list').addEventListener('click', function(e) {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});
```

**Benefits**:
1. **Better Performance**: Fewer event listeners
2. **Dynamic Elements**: Works with elements added after page load
3. **Memory Efficiency**: Reduced memory footprint

**Real Example**:
```javascript
document.getElementById('todo-list').addEventListener('click', function(e) {
  if (e.target.matches('.delete-btn')) {
    const todoItem = e.target.closest('.todo-item');
    todoItem.remove();
  }
  
  if (e.target.matches('.edit-btn')) {
    const todoItem = e.target.closest('.todo-item');
    editTodo(todoItem);
  }
});
```

---

## 30. Type Coercion vs Type Conversion

### Type Coercion (Implicit)
JavaScript automatically converts types when needed.

```javascript
// String coercion
"5" + 2        // "52" (number to string)
"5" - 2        // 3 (string to number)
"5" * "2"      // 10 (both to numbers)

// Boolean coercion
if ("hello") { } // true (non-empty string to true)
if (0) { }       // false (0 to false)

// Equality coercion
"5" == 5         // true (coerces string to number)
null == undefined // true (special case)
```

### Type Conversion (Explicit)
Developer explicitly converts types.

```javascript
// To String
String(123)           // "123"
(123).toString()      // "123"
123 + ""              // "123"

// To Number
Number("123")         // 123
parseInt("123px")     // 123
parseFloat("12.5")    // 12.5
+"123"                // 123 (unary plus)

// To Boolean
Boolean(1)            // true
Boolean(0)            // false
!!"hello"             // true (double negation)
```

**Falsy Values**: `false`, `0`, `""`, `null`, `undefined`, `NaN`

**Interview Tip**: Always use `===` (strict equality) to avoid unexpected coercion.

---

## 31. Throttle

**Throttling** ensures a function is called at most once in a specified time period, regardless of how many times the event is triggered.

```javascript
function throttle(func, delay) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log('Scroll event');
}, 1000);

window.addEventListener('scroll', handleScroll);
```

**Advanced with leading/trailing options**:
```javascript
function throttle(func, delay, options = {}) {
  let timeout;
  let lastCall = 0;
  const { leading = true, trailing = true } = options;
  
  return function(...args) {
    const now = Date.now();
    
    if (!lastCall && !leading) {
      lastCall = now;
    }
    
    const remaining = delay - (now - lastCall);
    
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      func.apply(this, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        lastCall = leading ? Date.now() : 0;
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}
```

**Use Cases**:
- Scroll events
- Window resizing
- Mouse movement tracking
- API rate limiting

---

## 32. Debounce

**Debouncing** delays function execution until after a specified time has passed since the last invocation.

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  // API call
}, 500);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
```

**Advanced with immediate execution**:
```javascript
function debounce(func, delay, immediate = false) {
  let timeoutId;
  
  return function(...args) {
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, delay);
    
    if (callNow) {
      func.apply(this, args);
    }
  };
}
```

**Throttle vs Debounce**:
- **Throttle**: Executes at regular intervals (every N ms)
- **Debounce**: Executes after activity stops (waits N ms of silence)

**Use Cases**:
- Search input (type-ahead)
- Form validation
- Window resize handlers
- Auto-save functionality

---

## 33. How JavaScript Parses and Compiles Code

JavaScript execution involves multiple phases:

### 1. Parsing Phase
```
Source Code → Lexical Analysis → Tokens → Syntax Analysis → AST
```

**Lexical Analysis (Tokenization)**:
Breaks code into tokens (keywords, identifiers, operators, etc.)

```javascript
const x = 10;
// Tokens: ["const", "x", "=", "10", ";"]
```

**Syntax Analysis**:
Creates Abstract Syntax Tree (AST) from tokens, checks for syntax errors.

### 2. Compilation Phase (JIT - Just-In-Time)

Modern JavaScript engines (V8, SpiderMonkey) use JIT compilation:

1. **Interpreter**: Quickly executes code by interpreting bytecode
2. **Profiler (Monitor)**: Identifies "hot" code (frequently executed)
3. **Compiler**: Optimizes hot code to machine code

**V8 Engine Pipeline**:
```
Source Code
    ↓
Parser → AST
    ↓
Ignition (Interpreter) → Bytecode
    ↓
TurboFan (Optimizing Compiler) → Optimized Machine Code
```

### 3. Execution Phase

1. **Memory Creation Phase** (Creation/Compilation):
   - Creates Execution Context
   - Sets up Variable Environment
   - Hoisting occurs (variables/functions moved to top)
   - `this` binding determined

2. **Code Execution Phase**:
   - Line-by-line code execution
   - Variable assignments
   - Function invocations

```javascript
console.log(x); // undefined (hoisted)
var x = 10;
sayHi();        // "Hello" (function hoisted)

function sayHi() {
  console.log("Hello");
}
```

**Optimization Techniques**:
- **Inline Caching**: Caches property access patterns
- **Hidden Classes**: Optimizes object property access
- **Escape Analysis**: Determines if objects can be stack-allocated

**Deoptimization**: When assumptions about code change, the engine deoptimizes back to bytecode.

---

## 34. Microtask Queue Infinite Loop Handling

If a microtask continuously adds new microtasks, it can block the event loop (starve macrotasks).

```javascript
// Problem: Infinite microtask loop
function infiniteMicrotask() {
  Promise.resolve().then(() => {
    console.log('Microtask');
    infiniteMicrotask(); // Adds another microtask
  });
}

infiniteMicrotask();

setTimeout(() => {
  console.log('This never runs'); // Starved
}, 0);
```

**Solutions**:

### 1. Use setTimeout (Convert to Macrotask)
```javascript
function controlledExecution() {
  Promise.resolve().then(() => {
    console.log('Microtask');
    setTimeout(controlledExecution, 0); // Allows other tasks
  });
}
```

### 2. Add Exit Condition
```javascript
let count = 0;

function limitedMicrotask() {
  if (count >= 1000) return; // Exit condition
  
  Promise.resolve().then(() => {
    count++;
    limitedMicrotask();
  });
}
```

### 3. Use queueMicrotask with Rate Limiting
```javascript
let taskCount = 0;
const MAX_TASKS = 100;

function safeMicrotask() {
  if (taskCount >= MAX_TASKS) {
    setTimeout(() => {
      taskCount = 0;
      safeMicrotask();
    }, 0);
    return;
  }
  
  queueMicrotask(() => {
    taskCount++;
    // Do work
    safeMicrotask();
  });
}
```

**Browser Protection**: Modern browsers have safeguards against infinite microtask loops, but it's still a problem to avoid.

---

## 35. First-Class Functions

In JavaScript, functions are **first-class citizens**, meaning they can be:
1. Assigned to variables
2. Passed as arguments
3. Returned from other functions
4. Stored in data structures

```javascript
// 1. Assigned to variables
const greet = function() {
  console.log("Hello");
};

// 2. Passed as arguments
function execute(fn) {
  fn();
}
execute(greet);

// 3. Returned from functions
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}
const double = createMultiplier(2);
console.log(double(5)); // 10

// 4. Stored in data structures
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
console.log(operations.add(5, 3)); // 8
```

**Higher-Order Functions**: Functions that take functions as arguments or return functions.

```javascript
// Array methods are higher-order functions
[1, 2, 3].map(x => x * 2);        // [2, 4, 6]
[1, 2, 3].filter(x => x > 1);     // [2, 3]
[1, 2, 3].reduce((sum, x) => sum + x, 0); // 6
```

---

## 36. Immediately Invoked Function Expressions (IIFE)

**IIFE** is a function that executes immediately after being defined.

```javascript
// Basic IIFE
(function() {
  console.log("I run immediately");
})();

// Arrow function IIFE
(() => {
  console.log("Arrow IIFE");
})();

// With parameters
(function(name) {
  console.log(`Hello, ${name}`);
})("John");
```

**Use Cases**:

### 1. Avoid Global Pollution
```javascript
(function() {
  var privateVar = "I'm private";
  // privateVar is not accessible outside
})();
```

### 2. Module Pattern
```javascript
const module = (function() {
  let privateCount = 0;
  
  return {
    increment() {
      privateCount++;
    },
    getCount() {
      return privateCount;
    }
  };
})();

module.increment();
console.log(module.getCount()); // 1
```

### 3. Async IIFE
```javascript
(async function() {
  const data = await fetch('/api/data');
  console.log(data);
})();
```

**Alternative Syntax**:
```javascript
!function() { }();
+function() { }();
-function() { }();
~function() { }();
void function() { }();
```

---

## 37. Call, Apply, and Bind

These methods control the `this` context in function execution.

### call()
Invokes function immediately with specified `this` and individual arguments.

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "John" };

greet.call(person, "Hello", "!"); // "Hello, John!"
```

### apply()
Similar to `call`, but takes arguments as an array.

```javascript
greet.apply(person, ["Hi", "!!"]); // "Hi, John!!"

// Useful for Math functions
const numbers = [1, 5, 3, 9, 2];
Math.max.apply(null, numbers); // 9
```

### bind()
Returns a new function with `this` permanently bound (doesn't invoke immediately).

```javascript
const boundGreet = greet.bind(person);
boundGreet(); // "John"
```

**Interview Tips**:
- Regular functions: `this` determined by call-site
- Arrow functions: `this` determined by lexical scope
- Use arrow functions to preserve `this` in callbacks

---

## 47. Function Declaration, Expression, Anonymous, Arrow Functions

### Function Declaration
Hoisted and can be called before definition.

```javascript
greet(); // Works

function greet() {
  console.log("Hello");
}
```

### Function Expression
Not hoisted, assigned to variable.

```javascript
// greet(); // Error

const greet = function() {
  console.log("Hello");
};

greet(); // Works
```

### Named Function Expression
```javascript
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

// fact is only available inside the function
```

### Anonymous Function
Function without a name (often used as callbacks).

```javascript
setTimeout(function() {
  console.log("Anonymous");
}, 1000);

[1, 2, 3].map(function(x) {
  return x * 2;
});
```

### Arrow Functions (ES6)
Concise syntax, lexical `this`, no `arguments` object.

```javascript
// Basic
const add = (a, b) => a + b;

// With block body
const multiply = (a, b) => {
  return a * b;
};

// Single parameter (parentheses optional)
const square = x => x * x;

// No parameters
const sayHi = () => console.log("Hi");

// Returning object (wrap in parentheses)
const makeObj = (name) => ({ name });
```

**Key Differences**:

| Feature | Regular Function | Arrow Function |
|---------|-----------------|----------------|
| `this` binding | Dynamic | Lexical |
| `arguments` object | Yes | No (use rest) |
| Constructor | Can use `new` | Cannot |
| `prototype` | Yes | No |
| Hoisting | Declaration only | No |

---

## 48. Async vs Defer

Both `async` and `defer` are attributes for `<script>` tags that control script loading and execution.

### Normal Script (Blocking)
```html
<script src="script.js"></script>
```
- **HTML parsing pauses**
- Script downloads
- Script executes
- HTML parsing resumes

### Defer
```html
<script src="script.js" defer></script>
```
- Scripts download **in parallel** with HTML parsing
- Execute **after** HTML parsing completes
- Execute in **order** they appear
- Execute before `DOMContentLoaded`

### Async
```html
<script src="script.js" async></script>
```
- Scripts download **in parallel** with HTML parsing
- Execute **as soon as** downloaded (pauses HTML parsing)
- Execute in **unpredictable order**
- May execute before or after `DOMContentLoaded`

**Comparison Table**:

| Attribute | Download | Execution | Order | Use Case |
|-----------|----------|-----------|-------|----------|
| None | Blocks HTML | Immediate | Sequential | Legacy |
| defer | Parallel | After HTML parsing | Sequential | Scripts that need DOM |
| async | Parallel | ASAP | Unpredictable | Independent scripts (analytics) |

**Visual Timeline**:
```
Normal:  [HTML] → [Download & Execute Script] → [HTML]
Defer:   [HTML + Download] → [HTML Done] → [Execute Scripts in order]
Async:   [HTML + Download] → [Execute when ready] → [HTML]
```

**Best Practices**:
- Use `defer` for most scripts (maintains order)
- Use `async` for independent scripts (analytics, ads)
- Place scripts at end of `<body>` if not using defer/async

---

## 49. Execution Context

**Execution Context** is the environment where JavaScript code is evaluated and executed.

### Types:

1. **Global Execution Context (GEC)**
   - Created when script first runs
   - Only one per program
   - Creates global object (`window` in browsers)

2. **Function Execution Context (FEC)**
   - Created when function is invoked
   - New context for each function call

3. **Eval Execution Context**
   - Code executed inside `eval()`

### Creation Phase (Memory Creation)
1. Create **Variable Environment**
2. Create **Lexical Environment**
3. Determine **`this`** binding

```javascript
// During creation phase:
function example() {
  console.log(a); // undefined (hoisted but not initialized)
  console.log(b); // ReferenceError (in TDZ)
  
  var a = 10;
  let b = 20;
}
```

**Variable Environment**:
```javascript
{
  a: undefined,        // var is hoisted with undefined
  example: <function>  // function declaration hoisted
}
```

**Lexical Environment**:
```javascript
{
  b: <uninitialized>, // let/const in TDZ
  const c: <uninitialized>
}
```

### Execution Phase
Line-by-line code execution with actual assignments.

```javascript
function outer() {
  var x = 10;
  
  function inner() {
    var y = 20;
    console.log(x + y); // Access outer's variable
  }
  
  inner();
}

outer();
```

**Execution Context Stack**:
```
1. Global EC created (at bottom)
2. outer() EC pushed
3. inner() EC pushed
4. inner() completes, popped
5. outer() completes, popped
6. Global EC remains
```

---

## 50. Call Stack

The **call stack** is a LIFO (Last-In-First-Out) data structure that tracks function execution.

```javascript
function first() {
  console.log("First");
  second();
  console.log("First again");
}

function second() {
  console.log("Second");
  third();
  console.log("Second again");
}

function third() {
  console.log("Third");
}

first();

// Call Stack visualization:
// [global]
// [global, first]
// [global, first, second]
// [global, first, second, third]
// [global, first, second]
// [global, first]
// [global]

// Output:
// First
// Second
// Third
// Second again
// First again
```

### Stack Overflow
Occurs when call stack exceeds maximum size (usually recursion without base case).

```javascript
function recursiveFunction() {
  recursiveFunction(); // No base case
}

recursiveFunction(); // RangeError: Maximum call stack size exceeded
```

**Maximum Stack Size**:
- Chrome: ~10,000-15,000 calls
- Firefox: ~50,000 calls
- Varies by browser and available memory

**Stack Trace**:
```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  throw new Error("Stack trace");
}

a();

// Error with stack trace:
// Error: Stack trace
//     at c (...)
//     at b (...)
//     at a (...)
```

---

## 51. Garbage Collection

**Garbage Collection (GC)** automatically frees memory by removing objects no longer referenced.

### Mark-and-Sweep Algorithm
Modern JavaScript engines (V8) use this approach:

1. **Mark Phase**: Traverse from roots (globals, call stack) and mark reachable objects
2. **Sweep Phase**: Delete unmarked objects

```javascript
let obj1 = { data: "Important" };
let obj2 = { data: "Also important" };

obj1 = null; // obj1 now eligible for GC (no references)
// obj2 still reachable, won't be collected
```

### Reference Counting (Older Method)
Tracks number of references; collects when count reaches zero.

**Problem: Circular References**
```javascript
function createCircular() {
  const obj1 = {};
  const obj2 = {};
  
  obj1.ref = obj2;
  obj2.ref = obj1; // Circular reference
  
  return "Created";
}

createCircular();
// Mark-and-sweep handles this
// Reference counting doesn't (memory leak)
```

### Memory Leaks

**1. Global Variables**
```javascript
function leak() {
  globalVar = "I leak"; // Forgot 'let/const'
}
```

**2. Forgotten Timers**
```javascript
const intervalId = setInterval(() => {
  // Holds references even when no longer needed
}, 1000);

// Always clear: clearInterval(intervalId);
```

**3. Closures**
```javascript
function createLeak() {
  const largeData = new Array(1000000).fill("data");
  
  return function() {
    console.log("Closure keeps largeData in memory");
  };
}
```

**4. Detached DOM Nodes**
```javascript
const button = document.getElementById('btn');
document.body.removeChild(button);
// If you still have a reference to 'button', it won't be GC'd
```

**5. Event Listeners Not Removed**
```javascript
const element = document.getElementById('el');
element.addEventListener('click', handleClick);

// Later: element.removeEventListener('click', handleClick);
```

### Best Practices:
- Nullify large objects when done
- Clear timers and intervals
- Remove event listeners
- Use WeakMap/WeakSet for object references that shouldn't prevent GC

```javascript
// WeakMap doesn't prevent GC
const weakMap = new WeakMap();
let obj = { data: "test" };
weakMap.set(obj, "value");

obj = null; // obj can be garbage collected even though it's in weakMap
```

---

## 52. Equality (=== vs ==)

### Strict Equality (===)
Compares **type** and **value** without coercion.

```javascript
5 === 5         // true
5 === "5"       // false (different types)
null === null   // true
undefined === undefined // true
null === undefined // false

// Objects compared by reference
{} === {}       // false (different references)
[] === []       // false

const obj = {};
obj === obj     // true (same reference)
```

### Loose Equality (==)
Performs **type coercion** before comparison.

```javascript
5 == "5"        // true (string coerced to number)
0 == false      // true
"" == false     // true
null == undefined // true (special case)

// Unexpected results
"0" == false    // true
[] == false     // true
[] == ![]       // true (!)
```

### Object.is() (ES6)
More precise than `===`:

```javascript
// Same as ===
Object.is(5, 5)  // true

// Differences:
+0 === -0             // true
Object.is(+0, -0)     // false

NaN === NaN           // false
Object.is(NaN, NaN)   // true
```

**Type Coercion Rules (==)**:
```javascript
null == undefined     // true
number == string      // Convert string to number
boolean == anything   // Convert boolean to number
object == primitive   // Call valueOf() then toString()
```

**Best Practice**: **Always use `===`** to avoid unexpected coercion bugs.

**Special Cases**:
```javascript
// Checking for null or undefined
if (value == null) {
  // true if value is null OR undefined
}

// Equivalent to:
if (value === null || value === undefined) {
  // ...
}
```

---

## 53. Strict Mode

**Strict mode** makes JavaScript more secure and catches common mistakes.

### Enabling Strict Mode

```javascript
// Entire script
"use strict";

function test() {
  // Strict mode applies here
}

// Single function
function strictFunction() {
  "use strict";
  // Only strict here
}

// ES6 modules are strict by default
export function myFunction() {
  // Strict mode
}
```

### Changes in Strict Mode

**1. Prevents Accidental Globals**
```javascript
"use strict";

function test() {
  variable = 10; // ReferenceError (forgot let/const)
}
```

**2. Throws on Assignment to Read-Only Properties**
```javascript
"use strict";

const obj = {};
Object.defineProperty(obj, "prop", { value: 10, writable: false });

obj.prop = 20; // TypeError
```

**3. Deleting Variables/Functions Not Allowed**
```javascript
"use strict";

let x = 10;
delete x; // SyntaxError

function test() {}
delete test; // SyntaxError
```

**4. Duplicate Parameter Names Not Allowed**
```javascript
"use strict";

function sum(a, a, b) { // SyntaxError
  return a + a + b;
}
```

**5. Octal Literals Not Allowed**
```javascript
"use strict";

const num = 010; // SyntaxError (use 0o10 instead)
```

**6. `this` is `undefined` in Functions**
```javascript
"use strict";

function test() {
  console.log(this); // undefined (not global object)
}

test();
```

**7. `with` Statement Not Allowed**
```javascript
"use strict";

with (obj) { // SyntaxError
  // ...
}
```

**8. `eval` Creates Separate Scope**
```javascript
"use strict";

eval("var x = 10;");
console.log(x); // ReferenceError (x not in outer scope)
```

**Benefits**:
- Catches silent errors
- Prevents unsafe actions
- Makes code optimization easier
- Prepares code for future JS versions

---

## 54. Lexical Environment

A **Lexical Environment** is a structure that holds identifier-variable mapping and a reference to the outer environment.

### Components:

1. **Environment Record**: Stores variables and function declarations
2. **Outer Environment Reference**: Link to parent lexical environment

```javascript
const global = "global";

function outer() {
  const outerVar = "outer";
  
  function inner() {
    const innerVar = "inner";
    console.log(innerVar);  // Own environment
    console.log(outerVar);  // Outer environment
    console.log(global);    // Global environment
  }
  
  inner();
}

outer();
```

**Lexical Environment Chain**:
```
Inner LE: { innerVar: "inner", outer: → Outer LE }
Outer LE: { outerVar: "outer", outer: → Global LE }
Global LE: { global: "global", outer: null }
```

### Variable Lookup:
1. Check current Lexical Environment
2. If not found, check outer environment
3. Continue until variable is found or reach global scope
4. If still not found, `ReferenceError`

### Closures and Lexical Environment
```javascript
function makeCounter() {
  let count = 0; // Stored in makeCounter's LE
  
  return function() {
    count++; // Accesses outer LE
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// Lexical environment of makeCounter is preserved
```

**Key Points**:
- Created during function creation (not invocation)
- Determines scope chain
- Basis for closures
- Garbage collected when no longer referenced

---

## Summary & Interview Tips

### Core Concepts to Master:
1. **Scope & Closures**: Understand lexical scoping and closure patterns
2. **Async Programming**: Event loop, promises, async/await
3. **Prototypes**: Inheritance mechanism in JavaScript
4. **this Binding**: Context determination in different scenarios
5. **Event Loop**: Microtasks vs macrotasks

### Common Interview Patterns:
- Implement polyfills (bind, map, reduce)
- Debounce/throttle implementations
- Closure-based problems (counter, cache)
- Promise chaining and error handling
- Async iteration patterns

### Performance Considerations:
- Minimize closure memory retention
- Use appropriate data structures (Map, Set, WeakMap)
- Understand garbage collection triggers
- Optimize event handlers with delegation
- Leverage async patterns for non-blocking code

### Best Practices:
- Prefer `const` > `let` > never `var`
- Always use `===` over `==`
- Enable strict mode
- Use arrow functions for lexical `this`
- Handle errors in promises/async functions
- Clean up event listeners and timers

**Pro Tip**: For 8+ years experience, interviewers expect:
- Deep understanding of "why" not just "how"
- Ability to explain trade-offs
- Knowledge of performance implications
- Experience with real-world debugging scenarios
- Understanding of browser/Node.js internalseet.bind(person, "Hey");
boundGreet("?"); // "Hey, John?"

// Useful for event handlers
class Counter {
  constructor() {
    this.count = 0;
    this.increment = this.increment.bind(this);
  }
  
  increment() {
    this.count++;
  }
}

const counter = new Counter();
button.addEventListener('click', counter.increment);
```

**Polyfill for bind** (Interview Question):
```javascript
Function.prototype.myBind = function(context, ...args) {
  const fn = this;
  
  return function(...newArgs) {
    return fn.apply(context, [...args, ...newArgs]);
  };
};
```

**Why Use These?**
- Borrowing methods from other objects
- Explicit `this` binding
- Partial application
- Event handler context preservation

---

## 38. MapLimit (Rate-Limited Async Operations)

**MapLimit** processes an array of items with a maximum concurrency limit.

```javascript
async function mapLimit(array, limit, asyncFunction) {
  const results = [];
  const executing = [];
  
  for (const [index, item] of array.entries()) {
    const promise = Promise.resolve().then(() => asyncFunction(item, index));
    results.push(promise);
    
    if (limit <= array.length) {
      const executing = promise.then(() => 
        executing.splice(executing.indexOf(executing), 1)
      );
      executing.push(executing);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  
  return Promise.all(results);
}

// Usage
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];

mapLimit(urls, 2, async (url) => {
  const response = await fetch(url);
  return response.json();
});
```

**Better Implementation**:
```javascript
async function mapLimit(array, limit, asyncFn) {
  const results = [];
  const queue = array.map((item, index) => ({ item, index }));
  
  async function worker() {
    while (queue.length > 0) {
      const { item, index } = queue.shift();
      results[index] = await asyncFn(item, index);
    }
  }
  
  const workers = Array(Math.min(limit, array.length))
    .fill()
    .map(() => worker());
  
  await Promise.all(workers);
  return results;
}
```

**Use Cases**:
- Batch API requests with rate limiting
- Parallel file processing
- Database operations with connection pooling

---

## 39. Async and Await

**async/await** provides syntactic sugar for working with Promises, making asynchronous code look synchronous.

### Async Functions
```javascript
// Returns a Promise
async function fetchData() {
  return "data"; // Automatically wrapped in Promise.resolve()
}

fetchData().then(data => console.log(data)); // "data"
```

### Await
Pauses execution until Promise resolves (only works in async functions).

```javascript
async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}
```

### Error Handling
```javascript
async function fetchWithErrorHandling() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Re-throw or handle
  }
}
```

### Parallel Execution
```javascript
// Sequential (slow)
async function sequential() {
  const result1 = await fetch('/api/1');
  const result2 = await fetch('/api/2');
  return [result1, result2];
}

// Parallel (fast)
async function parallel() {
  const [result1, result2] = await Promise.all([
    fetch('/api/1'),
    fetch('/api/2')
  ]);
  return [result1, result2];
}
```

### Top-Level Await (ES2022)
```javascript
// In modules
const data = await fetch('/api/data');
console.log(data);
```

**Common Pitfalls**:
```javascript
// ❌ Wrong: Awaiting in loops (sequential)
async function processItems(items) {
  for (const item of items) {
    await processItem(item); // Slow
  }
}

// ✅ Better: Parallel processing
async function processItems(items) {
  await Promise.all(items.map(item => processItem(item)));
}
```

---

## 40. Then and Catch

**then()** and **catch()** are methods for handling Promise resolution and rejection.

### then()
Handles successful Promise resolution.

```javascript
promise.then(onFulfilled, onRejected);

fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .then(() => console.log('Done'));
```

### catch()
Handles Promise rejection.

```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### finally()
Executes regardless of Promise outcome (ES2018).

```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log('Cleanup'));
```

### Chaining
Each `then` returns a new Promise.

```javascript
Promise.resolve(1)
  .then(x => x + 1)     // 2
  .then(x => x * 2)     // 4
  .then(x => {
    throw new Error('Oops');
  })
  .catch(err => {
    console.log('Caught:', err.message);
    return 10; // Recovery
  })
  .then(x => console.log(x)); // 10
```

**Error Propagation**:
```javascript
fetch('/api/1')
  .then(r => r.json())
  .then(data => fetch(`/api/${data.id}`))
  .then(r => r.json())
  .catch(err => {
    // Catches errors from any step above
    console.error(err);
  });
```

---

## 41. Variable Shadowing

**Variable shadowing** occurs when a variable in an inner scope has the same name as a variable in an outer scope.

```javascript
let x = 10;

function outer() {
  let x = 20; // Shadows outer x
  
  function inner() {
    let x = 30; // Shadows outer's x
    console.log(x); // 30
  }
  
  inner();
  console.log(x); // 20
}

outer();
console.log(x); // 10
```

### Illegal Shadowing
Cannot shadow `let`/`const` with `var` in the same scope.

```javascript
function test() {
  let a = 10;
  {
    var a = 20; // SyntaxError: Identifier 'a' has already been declared
  }
}
```

**Legal Shadowing**:
```javascript
function test() {
  var a = 10;
  {
    let a = 20; // Legal (block-scoped)
    console.log(a); // 20
  }
  console.log(a); // 10
}
```

---

## 42. Static Keyword in JavaScript Classes

**static** defines methods/properties that belong to the class itself, not to instances.

```javascript
class MathUtils {
  static PI = 3.14159;
  
  static add(a, b) {
    return a + b;
  }
  
  static #privateStaticMethod() {
    return "Private";
  }
}

console.log(MathUtils.PI);        // 3.14159
console.log(MathUtils.add(5, 3)); // 8

const utils = new MathUtils();
console.log(utils.add);           // undefined (not on instance)
```

**Static Initialization Block** (ES2022):
```javascript
class Database {
  static connection;
  
  static {
    // Runs once when class is evaluated
    this.connection = createConnection();
  }
}
```

**Use Cases**:
- Utility functions
- Factory methods
- Constants
- Singleton pattern

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
  
  static fromJSON(json) {
    const data = JSON.parse(json);
    return new User(data.name);
  }
}

const user = User.fromJSON('{"name":"John"}');
```

---

## 43. Undefined vs Not-Defined vs Null

### Undefined
Variable declared but not assigned a value.

```javascript
let x;
console.log(x);        // undefined
console.log(typeof x); // "undefined"

function test() {}
console.log(test());   // undefined (no return)

const obj = {};
console.log(obj.prop); // undefined (property doesn't exist)
```

### Not-Defined
Variable not declared at all.

```javascript
console.log(y); // ReferenceError: y is not defined
console.log(typeof y); // "undefined" (special behavior with typeof)
```

### Null
Intentional absence of value (assigned by programmer).

```javascript
let x = null;
console.log(x);        // null
console.log(typeof x); // "object" (JavaScript bug)

// Common use: Resetting values
let user = { name: "John" };
user = null; // Explicitly empty
```

**Comparison**:
```javascript
undefined == null  // true (loose equality)
undefined === null // false (different types)

typeof undefined   // "undefined"
typeof null        // "object" (historical bug)
```

**Best Practice**:
- Use `undefined` for uninitialized variables (default)
- Use `null` to explicitly represent "no value"

---

## 44. Higher-Order Functions

**Higher-order functions** either:
1. Take functions as arguments
2. Return functions

```javascript
// 1. Function as argument
function repeat(times, fn) {
  for (let i = 0; i < times; i++) {
    fn(i);
  }
}

repeat(3, (i) => console.log(i)); // 0, 1, 2

// 2. Returning function
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

**Built-in HOFs**:
```javascript
// map
[1, 2, 3].map(x => x * 2); // [2, 4, 6]

// filter
[1, 2, 3, 4].filter(x => x % 2 === 0); // [2, 4]

// reduce
[1, 2, 3].reduce((sum, x) => sum + x, 0); // 6

// forEach
[1, 2, 3].forEach(x => console.log(x));

// sort
[3, 1, 2].sort((a, b) => a - b); // [1, 2, 3]
```

**Custom HOF Example**:
```javascript
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = withLogging(add);
loggedAdd(2, 3);
// Calling add with [2, 3]
// Result: 5
```

---

## 45. Callback Hell

**Callback hell** (Pyramid of Doom) occurs with deeply nested callbacks, making code hard to read and maintain.

```javascript
// Callback hell
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      getYetMoreData(c, function(d) {
        getFinalData(d, function(e) {
          console.log(e);
        });
      });
    });
  });
});
```

**Solutions**:

### 1. Named Functions
```javascript
function handleFinalData(e) {
  console.log(e);
}

function handleYetMoreData(d) {
  getFinalData(d, handleFinalData);
}

function handleEvenMoreData(c) {
  getYetMoreData(c, handleYetMoreData);
}

getData(handleEvenMoreData);
```

### 2. Promises
```javascript
getData()
  .then(a => getMoreData(a))
  .then(b => getEvenMoreData(b))
  .then(c => getYetMoreData(c))
  .then(d => getFinalData(d))
  .then(e => console.log(e))
  .catch(err => console.error(err));
```

### 3. Async/Await
```javascript
async function fetchData() {
  try {
    const a = await getData();
    const b = await getMoreData(a);
    const c = await getEvenMoreData(b);
    const d = await getYetMoreData(c);
    const e = await getFinalData(d);
    console.log(e);
  } catch (err) {
    console.error(err);
  }
}
```

---

## 46. This Keyword in JavaScript

**`this`** refers to the context in which a function is executed. Its value depends on **how** the function is called.

### Global Context
```javascript
console.log(this); // Window (browser) or global (Node.js)
```

### Object Method
```javascript
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // "John"
  }
};

obj.greet();
```

### Function Call
```javascript
function showThis() {
  console.log(this);
}

showThis(); // Window (non-strict) or undefined (strict mode)
```

### Constructor Function
```javascript
function Person(name) {
  this.name = name; // `this` refers to new instance
}

const person = new Person("John");
console.log(person.name); // "John"
```

### Arrow Functions
Arrow functions don't have their own `this` - they inherit from lexical scope.

```javascript
const obj = {
  name: "John",
  regularFunc: function() {
    console.log(this.name); // "John"
  },
  arrowFunc: () => {
    console.log(this.name); // undefined (inherits from outer scope)
  }
};
```

### Event Handlers
```javascript
button.addEventListener('click', function() {
  console.log(this); // Button element
});

button.addEventListener('click', () => {
  console.log(this); // Window (arrow function)
});
```

### Explicit Binding (call, apply, bind)
```javascript
function greet() {
  console.log(this.name);
}

const person = { name: "John" };

greet.call(person);  // "John"
greet.apply(person); // "John"

const boundGreet = gr
