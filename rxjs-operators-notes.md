# 📚 Complete RxJS Operators Reference for Angular Interviews

## Table of Contents
1. [Creation Operators](#1-creation-operators)
2. [Transformation Operators](#2-transformation-operators)
3. [Filtering Operators](#3-filtering-operators)
4. [Combination Operators](#4-combination-operators)
5. [Error Handling Operators](#5-error-handling-operators)
6. [Utility Operators](#6-utility-operators)
7. [Multicasting Operators](#7-multicasting-operators)
8. [Common Angular Patterns](#8-common-angular-interview-patterns)
9. [Operator Comparison Guide](#9-operator-comparison-guide)
10. [Interview Tips & Tricks](#10-interview-tips--tricks)

---

## 1. Creation Operators
*Create new Observables from various sources*

### of()
**What it does**: Creates an Observable that emits the arguments you provide, then completes.

**Signature**: `of(...values)`

**When to use**:
- Return mock/static data
- Testing services
- Default/fallback values

**Example**:
```typescript
of(1, 2, 3).subscribe(val => console.log(val));
// Output: 1, 2, 3, then completes

// Angular service example
getUserMock(): Observable<User> {
  return of({ id: 1, name: 'John' });
}
```

**Interview Note**: `of()` emits synchronously and completes immediately.

---

### from()
**What it does**: Converts arrays, promises, iterables, or observables into an Observable.

**Signature**: `from(input)`

**When to use**:
- Convert arrays to streams
- Convert Promises to Observables
- Iterate over any iterable

**Example**:
```typescript
// From array
from([10, 20, 30]).subscribe(val => console.log(val));

// From Promise
from(fetch('/api/data')).subscribe(response => console.log(response));

// From string (iterable)
from('hello').subscribe(char => console.log(char)); // h, e, l, l, o
```

**Interview Note**: Unlike `of()`, `from([1,2,3])` emits each item separately, while `of([1,2,3])` emits the entire array as one value.

---

### interval()
**What it does**: Emits sequential numbers at specified time intervals (in milliseconds).

**Signature**: `interval(period)`

**When to use**:
- Polling APIs
- Auto-refresh functionality
- Timers and countdowns

**Example**:
```typescript
interval(1000).subscribe(val => console.log(val));
// Output: 0 (after 1s), 1 (after 2s), 2 (after 3s)...

// Angular: Poll API every 5 seconds
interval(5000).pipe(
  switchMap(() => this.http.get('/api/status'))
).subscribe(status => this.status = status);
```

**Interview Note**: Starts counting from 0. Never completes unless you use operators like `take()`.

---

### timer()
**What it does**: Emits a value after a delay, optionally repeating at intervals.

**Signature**: `timer(initialDelay, period?)`

**When to use**:
- Delayed operations
- Scheduled tasks
- One-time delays

**Example**:
```typescript
// Emit once after 3 seconds
timer(3000).subscribe(() => console.log('3 seconds passed'));

// Wait 2s, then emit every 1s
timer(2000, 1000).subscribe(val => console.log(val));
// Output: 0 (after 2s), 1 (after 3s), 2 (after 4s)...

// Angular: Delayed notification
timer(5000).subscribe(() => this.showNotification());
```

**Interview Note**: `timer(0)` emits immediately (async). `timer(3000)` is like `setTimeout`, `timer(0, 1000)` is like `setInterval`.

---

### defer()
**What it does**: Creates Observable lazily - only when subscribed to.

**Signature**: `defer(observableFactory)`

**When to use**:
- Lazy evaluation
- Create fresh Observable per subscription
- Decision logic at subscription time

**Example**:
```typescript
const random$ = defer(() => of(Math.random()));

random$.subscribe(val => console.log(val)); // 0.234
random$.subscribe(val => console.log(val)); // 0.789 (different value!)

// Angular: Conditional observable creation
defer(() => {
  if (this.isLoggedIn) {
    return this.http.get('/api/user-data');
  } else {
    return of(null);
  }
});
```

---

## 2. Transformation Operators
*Transform values emitted by Observables*

### map()
**What it does**: Transforms each emitted value using a projection function.

**Signature**: `map(project: (value, index) => any)`

**When to use**:
- Transform/modify data
- Extract properties
- Convert data types

**Example**:
```typescript
from([1, 2, 3]).pipe(
  map(x => x * 10)
).subscribe(val => console.log(val)); // 10, 20, 30

// Angular: Extract data from HTTP response
this.http.get<ApiResponse>('/api/users').pipe(
  map(response => response.data.users)
).subscribe(users => this.users = users);

// With index
from(['a', 'b', 'c']).pipe(
  map((letter, index) => `${index}: ${letter}`)
).subscribe(console.log); // 0: a, 1: b, 2: c
```

**Interview Note**: Synchronous transformation. Returns non-Observable values. For Observable results, use `switchMap`, `mergeMap`, etc.

---

### switchMap()
**What it does**: Maps to an inner Observable, cancels previous inner Observable when new value arrives.

**Signature**: `switchMap(project: (value) => Observable)`

**When to use**:
- HTTP requests that should cancel previous (search, autocomplete)
- Navigation scenarios
- Latest value matters, not all values

**Example**:
```typescript
// Search with autocomplete
searchInput$.pipe(
  debounceTime(300),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
).subscribe(results => this.results = results);

// Angular routing
this.route.params.pipe(
  switchMap(params => this.http.get(`/api/user/${params.id}`))
).subscribe(user => this.user = user);
```

**Visual**:
```
Source:     --1--2--3--|
            switchMap(x => interval(1000))
Inner 1:    --0--1--2--X (cancelled)
Inner 2:    ----0--1--X (cancelled)
Inner 3:    ------0--1--2--3--|
Result:     ------0--1--2--3--|
```

**Interview Note**: CANCELS previous. Use when only latest result matters. Most common operator in Angular!

---

### mergeMap() / flatMap()
**What it does**: Maps to inner Observable, maintains all subscriptions concurrently.

**Signature**: `mergeMap(project: (value) => Observable, concurrent?: number)`

**When to use**:
- Multiple concurrent HTTP requests
- File uploads (process all simultaneously)
- Order doesn't matter, want all results

**Example**:
```typescript
// Fetch multiple users concurrently
from([1, 2, 3]).pipe(
  mergeMap(id => this.http.get(`/api/user/${id}`))
).subscribe(user => console.log(user));
// All 3 HTTP requests happen at the same time

// Limit concurrency
from(fileArray).pipe(
  mergeMap(file => this.uploadFile(file), 2) // Max 2 uploads at once
).subscribe(result => console.log(result));
```

**Visual**:
```
Source:     --1--2--3--|
            mergeMap(x => interval(1000))
Inner 1:    --0--1--2--3--4--|
Inner 2:    ----0--1--2--3--4--|
Inner 3:    ------0--1--2--3--4--|
Result:     --0-01-012-123-234-34-4--|
```

**Interview Note**: Does NOT cancel. All inner Observables run simultaneously. Can cause memory issues if uncontrolled.

---

### concatMap()
**What it does**: Maps to inner Observable, waits for each to complete before starting next.

**Signature**: `concatMap(project: (value) => Observable)`

**When to use**:
- Sequential operations (order critical)
- Queue processing
- One-at-a-time HTTP requests

**Example**:
```typescript
// Process items sequentially
from([1, 2, 3]).pipe(
  concatMap(id => this.http.post(`/api/process/${id}`, data))
).subscribe(result => console.log(result));
// Request 2 starts only after Request 1 completes

// Angular: Sequential animations
from(['step1', 'step2', 'step3']).pipe(
  concatMap(step => this.animateStep(step))
).subscribe();
```

**Visual**:
```
Source:     --1--2--3--|
            concatMap(x => timer(1000))
Inner 1:    --0|
Inner 2:       --0|
Inner 3:          --0|
Result:     --0--0--0|
```

**Interview Note**: Maintains ORDER. Slower than `mergeMap` but guarantees sequence. Good for dependent operations.

---

### exhaustMap()
**What it does**: Maps to inner Observable, IGNORES new values while inner is active.

**Signature**: `exhaustMap(project: (value) => Observable)`

**When to use**:
- Prevent duplicate form submissions
- Login buttons (ignore rapid clicks)
- Prevent spam clicking

**Example**:
```typescript
// Login button - ignore clicks while logging in
loginButton$.pipe(
  exhaustMap(() => this.authService.login(credentials))
).subscribe(result => this.handleLoginResult(result));

// Form submission
this.form.submit$.pipe(
  exhaustMap(() => this.http.post('/api/save', this.form.value))
).subscribe(response => this.showSuccess());
```

**Visual**:
```
Source:     --1--2--3--4--5--|
            exhaustMap(x => timer(2000))
Inner 1:    --0|
Inner 3:          --0|
Inner 5:                  --0|
Result:     --0------0------0|
(2 and 4 are ignored)
```

**Interview Note**: Opposite of `switchMap`. Keeps current, ignores new. Perfect for preventing duplicate actions.

---

### mergeAll() / concatAll() / switchAll()
**What it does**: Flattens higher-order Observable (Observable of Observables).

**When to use**:
- After `map()` returns Observables
- Flattening nested streams

**Example**:
```typescript
// Instead of:
source$.pipe(
  map(x => this.http.get(`/api/${x}`)),
  mergeAll()
)

// You typically use:
source$.pipe(
  mergeMap(x => this.http.get(`/api/${x}`))
)
```

**Interview Note**: `mergeMap = map + mergeAll`, `switchMap = map + switchAll`, `concatMap = map + concatAll`

---

### scan()
**What it does**: Accumulator function (like `reduce()` but emits intermediate values).

**Signature**: `scan(accumulator, seed?)`

**When to use**:
- Running totals
- Maintaining state over time
- Building up values

**Example**:
```typescript
from([1, 2, 3, 4]).pipe(
  scan((acc, val) => acc + val, 0)
).subscribe(console.log);
// Output: 1, 3, 6, 10

// Angular: Cart total
this.cartItems$.pipe(
  scan((total, item) => total + item.price, 0)
).subscribe(total => this.cartTotal = total);

// State management
actions$.pipe(
  scan((state, action) => this.reducer(state, action), initialState)
).subscribe(state => this.state = state);
```

**Interview Note**: Emits on each value. Use `reduce()` if you only want the final result.

---

### pluck()
**What it does**: Extracts nested property from each emitted object.

**Signature**: `pluck(...properties: string[])`

**When to use**:
- Extract specific properties
- Simplify nested access

**Example**:
```typescript
from([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]).pipe(
  pluck('name')
).subscribe(console.log); // 'John', 'Jane'

// Nested properties
from([
  { user: { profile: { name: 'John' } } }
]).pipe(
  pluck('user', 'profile', 'name')
).subscribe(console.log); // 'John'

// Angular: Extract from response
this.http.get('/api/data').pipe(
  pluck('data', 'users')
).subscribe(users => this.users = users);
```

**Interview Note**: Deprecated in RxJS 8, use `map(x => x.property)` instead. Still appears in legacy code.

---

### reduce()
**What it does**: Reduces values to a single value, emits only when source completes.

**Signature**: `reduce(accumulator, seed?)`

**When to use**:
- Final aggregated result
- Similar to Array.reduce()

**Example**:
```typescript
from([1, 2, 3, 4]).pipe(
  reduce((acc, val) => acc + val, 0)
).subscribe(console.log); // Only emits: 10

// Angular: Calculate total
this.orders$.pipe(
  reduce((total, order) => total + order.amount, 0)
).subscribe(total => this.grandTotal = total);
```

**Interview Note**: Only emits ONCE when source completes. Use `scan()` for intermediate values.

---

## 3. Filtering Operators
*Control which values pass through the stream*

### filter()
**What it does**: Emits only values that pass the predicate function.

**Signature**: `filter(predicate: (value, index) => boolean)`

**When to use**:
- Conditional logic
- Remove unwanted values
- Data filtering

**Example**:
```typescript
from([1, 2, 3, 4, 5, 6]).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log); // 2, 4, 6

// Angular: Filter form changes
this.form.valueChanges.pipe(
  filter(value => value.email.includes('@')),
  filter(value => value.password.length >= 8)
).subscribe(validValue => this.enableSubmit());

// With index
from(['a', 'b', 'c']).pipe(
  filter((val, index) => index > 0)
).subscribe(console.log); // 'b', 'c'
```

**Interview Note**: Synchronous check. Returns boolean. Can filter by index too.

---

### debounceTime()
**What it does**: Emits value only after specified time has passed without another emission.

**Signature**: `debounceTime(dueTime: number)`

**When to use**:
- Search input (wait for user to stop typing)
- Window resize events
- Auto-save after pause

**Example**:
```typescript
searchInput$.pipe(
  debounceTime(300)
).subscribe(value => this.search(value));

// Angular: Search autocomplete
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
).subscribe(results => this.results = results);
```

**Visual**:
```
Source:  --1--2--3--------4--5----|
         debounceTime(20ms)
Result:  --------3------------5---|
```

**Interview Note**: Waits for "quiet period". Delays by specified time. Classic use: search inputs.

---

### throttleTime()
**What it does**: Emits first value, then ignores values for duration.

**Signature**: `throttleTime(duration: number, config?)`

**When to use**:
- Rate limiting (scroll, mouse move)
- Button click prevention
- Performance optimization for high-frequency events

**Example**:
```typescript
fromEvent(window, 'scroll').pipe(
  throttleTime(1000)
).subscribe(event => this.handleScroll(event));
// Handles scroll at most once per second

// Button clicks
saveButton$.pipe(
  throttleTime(2000)
).subscribe(() => this.save());
// Allows one save per 2 seconds
```

**Visual**:
```
Source:  --1--2--3--4--5--6--7--|
         throttleTime(20ms)
Result:  --1--------4--------7--|
```

**Interview Note**: Emits FIRST value in window. `debounceTime` emits LAST. Use throttleTime for events that should execute immediately but not too often.

---

### distinctUntilChanged()
**What it does**: Only emits when current value differs from previous value.

**Signature**: `distinctUntilChanged(compare?)`

**When to use**:
- Prevent duplicate emissions
- Optimize change detection
- Avoid redundant API calls

**Example**:
```typescript
from([1, 1, 2, 2, 3, 1]).pipe(
  distinctUntilChanged()
).subscribe(console.log); // 1, 2, 3, 1

// Angular: Form control
this.formControl.valueChanges.pipe(
  distinctUntilChanged()
).subscribe(value => console.log('Actually changed:', value));

// Custom comparison
this.users$.pipe(
  distinctUntilChanged((prev, curr) => prev.id === curr.id)
).subscribe(user => this.currentUser = user);
```

**Interview Note**: Only compares with PREVIOUS value (not all values). For comparing with all, use `distinct()`.

---

### distinct()
**What it does**: Emits values that haven't been emitted before.

**Signature**: `distinct(keySelector?, flushes?)`

**When to use**:
- Remove all duplicates from stream
- Unique values only

**Example**:
```typescript
from([1, 2, 1, 3, 2, 4]).pipe(
  distinct()
).subscribe(console.log); // 1, 2, 3, 4

// With key selector
from([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John Doe' }
]).pipe(
  distinct(user => user.id)
).subscribe(console.log); // Only first occurrence of each id
```

**Interview Note**: Keeps track of ALL previous values (memory consideration). Use `distinctUntilChanged()` for consecutive duplicates only.

---

### take()
**What it does**: Emits only the first N values, then completes.

**Signature**: `take(count: number)`

**When to use**:
- Limit emissions
- Take first N items
- One-time operations

**Example**:
```typescript
interval(1000).pipe(
  take(5)
).subscribe(console.log); // 0, 1, 2, 3, 4, then completes

// Angular: Get first value
this.route.params.pipe(
  take(1)
).subscribe(params => console.log('Initial params:', params));
```

**Interview Note**: Automatically completes after N emissions. Great for limiting infinite streams.

---

### takeUntil()
**What it does**: Emits until another Observable (notifier) emits.

**Signature**: `takeUntil(notifier: Observable)`

**When to use**:
- Unsubscribe pattern in Angular
- Stop streams based on events
- Component lifecycle management

**Example**:
```typescript
// Angular: Standard unsubscribe pattern
private destroy$ = new Subject<void>();

ngOnInit() {
  interval(1000).pipe(
    takeUntil(this.destroy$)
  ).subscribe(val => console.log(val));
  
  this.dataService.getData().pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// Stop on button click
source$.pipe(
  takeUntil(stopButton$)
).subscribe(val => console.log(val));
```

**Interview Note**: THE standard unsubscribe pattern in Angular. When notifier emits ANY value, source completes.

---

### takeWhile()
**What it does**: Emits while predicate returns true, completes when false.

**Signature**: `takeWhile(predicate: (value) => boolean, inclusive?)`

**When to use**:
- Conditional completion
- Take until condition fails

**Example**:
```typescript
from([1, 2, 3, 4, 5]).pipe(
  takeWhile(x => x < 4)
).subscribe(console.log); // 1, 2, 3

// With inclusive flag
from([1, 2, 3, 4, 5]).pipe(
  takeWhile(x => x < 4, true)
).subscribe(console.log); // 1, 2, 3, 4

// Angular: Load until quota reached
this.loadItems().pipe(
  scan((acc, item) => acc + item.size, 0),
  takeWhile(totalSize => totalSize < maxQuota)
).subscribe(size => this.currentSize = size);
```

---

### skip()
**What it does**: Skips the first N values from source.

**Signature**: `skip(count: number)`

**When to use**:
- Ignore initial emissions
- Skip first N values

**Example**:
```typescript
from([1, 2, 3, 4, 5]).pipe(
  skip(2)
).subscribe(console.log); // 3, 4, 5

// Angular: Skip initial form value
this.form.valueChanges.pipe(
  skip(1) // Skip initial value
).subscribe(changes => this.handleUserChange(changes));
```

---

### skipUntil()
**What it does**: Skips emissions until notifier Observable emits.

**Signature**: `skipUntil(notifier: Observable)`

**When to use**:
- Wait for initialization
- Start processing after event

**Example**:
```typescript
source$.pipe(
  skipUntil(initComplete$)
).subscribe(val => console.log(val));

// Angular: Wait for auth
this.dataStream$.pipe(
  skipUntil(this.authService.authenticated$)
).subscribe(data => this.processData(data));
```

---

### first()
**What it does**: Emits only the first value (or first matching predicate), then completes.

**Signature**: `first(predicate?, defaultValue?)`

**When to use**:
- Get first emission
- Find first matching value
- One-time snapshot

**Example**:
```typescript
from([1, 2, 3, 4, 5]).pipe(
  first()
).subscribe(console.log); // 1

// With predicate
from([1, 2, 3, 4, 5]).pipe(
  first(x => x > 3)
).subscribe(console.log); // 4

// With default (if no match)
from([1, 2, 3]).pipe(
  first(x => x > 10, 999)
).subscribe(console.log); // 999

// Angular: Get initial route param
this.route.params.pipe(
  first()
).subscribe(params => this.initialId = params.id);
```

**Interview Note**: Completes after first emission. Throws error if source completes without emitting (unless default provided).

---

### last()
**What it does**: Emits only the last value before source completes.

**Signature**: `last(predicate?, defaultValue?)`

**When to use**:
- Get final value
- Find last matching value

**Example**:
```typescript
from([1, 2, 3, 4, 5]).pipe(
  last()
).subscribe(console.log); // 5

from([1, 2, 3, 4, 5]).pipe(
  last(x => x < 4)
).subscribe(console.log); // 3
```

**Interview Note**: Only emits when source COMPLETES. Won't work with never-ending streams.

---

### sample()
**What it does**: Emits most recent value when notifier emits.

**Signature**: `sample(notifier: Observable)`

**When to use**:
- Snapshot values at intervals
- Periodic sampling

**Example**:
```typescript
source$.pipe(
  sample(interval(1000))
).subscribe(val => console.log(val));
// Emits latest source value every second

// Angular: Sample user input on save
this.formChanges$.pipe(
  sample(this.saveButton$)
).subscribe(formValue => this.save(formValue));
```

---

### audit() / auditTime()
**What it does**: Similar to throttle, but emits LAST value instead of first.

**Signature**: `auditTime(duration: number)`

**When to use**:
- Rate limiting with latest value
- Like throttle but want most recent

**Example**:
```typescript
clicks$.pipe(
  auditTime(1000)
).subscribe(click => this.handleClick(click));
```

**Visual**:
```
Source:  --1--2--3--4--5--6--7--|
         auditTime(20ms)
Result:  -----2--------5--------7|
```

**Interview Note**: `throttleTime` emits first in window, `auditTime` emits last in window.

---

## 4. Combination Operators
*Combine multiple Observables*

### combineLatest()
**What it does**: Combines multiple Observables, emits when ANY emits (after all have emitted at least once).

**Signature**: `combineLatest([obs1, obs2, ...]) or combineLatest({key1: obs1, key2: obs2})`

**When to use**:
- Form validation (multiple fields)
- Combine dependent streams
- Dashboard with multiple data sources
- Real-time calculations

**Example**:
```typescript
// Array syntax
combineLatest([
  this.firstName$,
  this.lastName$
]).subscribe(([first, last]) => {
  this.fullName = `${first} ${last}`;
});

// Object syntax (cleaner)
combineLatest({
  user: this.userService.getUser(),
  settings: this.settingsService.getSettings(),
  permissions: this.permService.getPermissions()
}).subscribe(({user, settings, permissions}) => {
  this.initializeApp(user, settings, permissions);
});

// Angular: Complex form validation
combineLatest([
  this.emailControl.valueChanges,
  this.passwordControl.valueChanges,
  this.termsControl.valueChanges
]).pipe(
  map(([email, password, terms]) => 
    this.isValidEmail(email) && 
    password.length >= 8 && 
    terms === true
  )
).subscribe(isValid => this.submitButton.disabled = !isValid);
```

**Visual**:
```
A:      --1-----2-----3--|
B:      ----a-----b-----c|
        combineLatest([A, B])
Result: ----[1,a]-[2,a]-[2,b]-[3,b]-[3,c]|
```

**Interview Note**: 
- Waits for ALL sources to emit at least once
- Then emits on EVERY emission from any source
- Always has latest value from each source
- Good for reactive forms

---

### forkJoin()
**What it does**: Waits for ALL Observables to COMPLETE, then emits last value from each as array/object.

**Signature**: `forkJoin([obs1, obs2, ...]) or forkJoin({key1: obs1, key2: obs2})`

**When to use**:
- Parallel HTTP requests (wait for all)
- Load multiple resources before proceeding
- Initialize app with multiple API calls
- Like Promise.all()

**Example**:
```typescript
// Array syntax
forkJoin([
  this.http.get('/api/users'),
  this.http.get('/api/posts'),
  this.http.get('/api/comments')
]).subscribe(([users, posts, comments]) => {
  console.log('All loaded', users, posts, comments);
});

// Object syntax (recommended)
forkJoin({
  users: this.http.get('/api/users'),
  roles: this.http.get('/api/roles'),
  permissions: this.http.get('/api/permissions')
}).pipe(
  finalize(() => this.loading = false)
).subscribe(({users, roles, permissions}) => {
  this.users = users;
  this.roles = roles;
  this.permissions = permissions;
});

// Angular: Component initialization
ngOnInit() {
  this.loading = true;
  
  forkJoin({
    profile: this.userService.getProfile(),
    notifications: this.notificationService.getAll(),
    config: this.configService.load()
  }).subscribe({
    next: (data) => this.initializeComponent(data),
    error: (err) => this.handleError(err),
    complete: () => this.loading = false
  });
}
```

**Visual**:
```
A:      --1--2--3--|
B:      ----a--b--c--|
C:      ------x--y--z--|
        forkJoin([A, B, C])
Result: -----------[3, c, z]|
```

**Interview Note**: 
- Like Promise.all() - parallel execution
- Only emits ONCE when ALL complete
- If any Observable errors, entire forkJoin errors
- If any Observable never completes, forkJoin never emits
- Perfect for loading multiple independent resources

---

### merge()
**What it does**: Merges multiple Observables into one, emitting all values as they occur.

**Signature**: `merge(...observables, concurrent?)`

**When to use**:
- Combine multiple event sources
- Handle multiple user actions
- Aggregate similar streams

**Example**:
```typescript
merge(
  this.saveButton$,
  this.keyboardShortcut$,
  this.autoSave$
).subscribe(() => this.save());

// Angular: Multiple action triggers
merge(
  this.refreshButton$.pipe(map(() => 'button')),
  this.interval$.pipe(map(() => 'interval')),
  this.websocket$.pipe(map(() => 'websocket'))
).pipe(
  switchMap(source => {
    console.log('Refresh triggered by:', source);
    return this.http.get('/api/data');
  })
).subscribe(data => this.data = data);

// Merge error handlers
merge(
  this.userErrors$,
  this.networkErrors$,
  this.validationErrors$
).subscribe(error => this.showError(error));
```

**Visual**:
```
A:      --1----2----3--|
B:      ----a----b----c|
        merge(A, B)
Result: --1-a--2-b--3-c|
```

**Interview Note**: 
- All subscriptions happen immediately
- Flattens multiple sources into one
- First-come, first-served emission
- Completes when ALL sources complete

---

### concat()
**What it does**: Subscribes to Observables sequentially (one after previous completes).

**Signature**: `concat(...observables)`

**When to use**:
- Sequential operations
- Animation sequences
- Ordered API calls

**Example**:
```typescript
concat(
  this.http.post('/api/create', data),
  this.http.put('/api/update', moreData),
  this.http.get('/api/verify')
).subscribe(result => console.log(result));

// Angular: Sequential animations
concat(
  this.fadeOut(),
  this.slideIn(),
  this.highlight()
).subscribe();
```

**Visual**:
```
A:      --1--2--|
B:      ----a--b--|
C:      ------x--y--|
        concat(A, B, C)
Result: --1--2-----a--b------x--y--|
```

**Interview Note**: 
- Maintains strict ORDER
- Waits for each to complete before starting next
- Like Promise chaining with .then()
- One subscription at a time

---

### race()
**What it does**: Subscribes to all Observables, emits from the first one that emits, unsubscribes from others.

**Signature**: `race(...observables)`

**When to use**:
- Fallback mechanisms
- Fastest response wins
- Timeout patterns

**Example**:
```typescript
// First API to respond wins
race(
  this.http.get('/api/server1/data'),
  this.http.get('/api/server2/data'),
  this.http.get('/api/server3/data')
).subscribe(data => console.log('Fastest response:', data));

// Timeout pattern
race(
  this.http.get('/api/data'),
  timer(5000).pipe(
    switchMap(() => throwError(() => new Error('Timeout')))
  )
).subscribe({
  next: data => this.data = data,
  error: err => this.handleTimeout(err)
});
```

**Interview Note**: "Winner takes all" - first emission determines the winner.

---

### zip()
**What it does**: Combines Observables by pairing values by index (1st with 1st, 2nd with 2nd, etc.).

**Signature**: `zip(...observables)`

**When to use**:
- Pair related data
- Synchronized streams
- Combine by position

**Example**:
```typescript
zip(
  from([1, 2, 3]),
  from(['a', 'b', 'c']),
  from([10, 20, 30])
).subscribe(([num, letter, value]) => {
  console.log(num, letter, value);
});
// Output: [1, 'a', 10], [2, 'b', 20], [3, 'c', 30]

// Angular: Combine parallel streams
zip(
  interval(100),
  from(['Loading', 'Processing', 'Complete'])
).subscribe(([count, message]) => {
  this.status = `${message} (${count})`;
});
```

**Visual**:
```
A:      --1----2----3----|
B:      ------a----b----c|
        zip(A, B)
Result: ------[1,a]-[2,b]-[3,c]|
```

**Interview Note**: 
- Waits for corresponding index from each source
- Completes when ANY source completes
- Creates "tuples" of paired values

---

### withLatestFrom()
**What it does**: Combines source with latest values from other Observables when source emits.

**Signature**: `source.pipe(withLatestFrom(...observables))`

**When to use**:
- Add context to events
- Include current state with actions
- Primary/secondary relationship

**Example**:
```typescript
// Add context to clicks
buttonClick$.pipe(
  withLatestFrom(currentUser$, appSettings$)
).subscribe(([click, user, settings]) => {
  console.log('Click with context:', { click, user, settings });
});

// Angular: Form submission with current state
this.submitButton$.pipe(
  withLatestFrom(
    this.formValue$,
    this.isValid$,
    this.permissions$
  )
).subscribe(([_, formData, isValid, permissions]) => {
  if (isValid && permissions.canSubmit) {
    this.save(formData);
  }
});
```

**Visual**:
```
A (source): --1----2----3----|
B:          ------a--------b-|
            withLatestFrom(B)
Result:     ------[2,a]-[3,b]|
```

**Interview Note**: 
- Only emits when SOURCE emits
- Uses latest value from others (doesn't wait)
- Others must have emitted at least once
- Different from combineLatest (which emits on any change)

---

### startWith()
**What it does**: Emits specified value(s) before source begins emitting.

**Signature**: `startWith(...values)`

**When to use**:
- Provide initial value
- Default state
- Loading states

**Example**:
```typescript
this.http.get('/api/data').pipe(
  startWith([]) // Empty array while loading
).subscribe(data => this.data = data);

// Angular: Search with initial state
this.searchResults$ = this.searchTerm$.pipe(
  debounceTime(300),
  switchMap(term => this.search(term)),
  startWith([]) // Show empty initially
);

// Loading indicator
this.loading$ = this.dataStream$.pipe(
  map(() => false),
  startWith(true)
);
```

**Interview Note**: Emits synchronously before subscription. Great for initial values in templates.

---

### endWith()
**What it does**: Emits specified value(s) after source completes.

**Signature**: `endWith(...values)`

**When to use**:
- Append final values
- Cleanup indicators

**Example**:
```typescript
from([1, 2, 3]).pipe(
  endWith(999)
).subscribe(console.log); // 1, 2, 3, 999
```

---

### pairwise()
**What it does**: Groups consecutive emissions as pairs [previous, current].

**Signature**: `pairwise()`

**When to use**:
- Compare consecutive values
- Track changes
- Detect trends

**Example**:
```typescript
from([1, 2, 3, 4, 5]).pipe(
  pairwise()
).subscribe(console.log);
// [1,2], [2,3], [3,4], [4,5]

// Angular: Detect scroll direction
fromEvent(window, 'scroll').pipe(
  map(() => window.scrollY),
  pairwise(),
  map(([prev, curr]) => curr > prev ? 'down' : 'up')
).subscribe(direction => this.scrollDirection = direction);
```

---

## 5. Error Handling Operators

### catchError()
**What it does**: Catches errors and returns a new Observable or rethrows.

**Signature**: `catchError((error, caught) => Observable)`

**When to use**:
- HTTP error handling
- Fallback values
- Error recovery
- Prevent stream termination

**Example**:
```typescript
// Return fallback value
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('Error occurred:', error);
    return of([]); // Return empty array
  })
).subscribe(data => this.data = data);

// Return different Observable
this.http.get('/api/primary').pipe(
  catchError(() => this.http.get('/api/backup'))
).subscribe(data => this.data = data);

// Re-throw with modification
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('API Error:', error);
    return throwError(() => new Error('Custom error message'));
  })
).subscribe({
  next: data => this.data = data,
  error: err => this.showError(err)
});

// Angular: Graceful degradation
this.userService.getUser(id).pipe(
  catchError(error => {
    if (error.status === 404) {
      return of(this.getDefaultUser());
    }
    return throwError(() => error);
  })
).subscribe(user => this.user = user);
```

**Interview Note**: 
- Must return an Observable
- Stream continues with returned Observable
- Place it where you want to handle errors
- Can be used multiple times in chain

---

### retry()
**What it does**: Resubscribes to source Observable N times on error.

**Signature**: `retry(count?: number) or retry({count, delay})`

**When to use**:
- Network failures
- Transient errors
- Resilience patterns

**Example**:
```typescript
// Retry 3 times
this.http.get('/api/data').pipe(
  retry(3),
  catchError(error => of([]))
).subscribe(data => this.data = data);

// Retry with delay (RxJS 7+)
this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: 1000 // Wait 1s between retries
  }),
  catchError(error => of([]))
).subscribe(data => this.data = data);

// Angular: Robust API call
this.apiService.fetchData().pipe(
  retry({ count: 3, delay: 2000 }),
  catchError(error => {
    this.showError('Failed after 3 retries');
    return of(null);
  })
).subscribe(data => this.handleData(data));
```

**Interview Note**: 
- Retries immediately by default
- Use with catchError to provide fallback
- Total attempts = 1 + retry count

---

### retryWhen()
**What it does**: Resubscribes based on custom logic (with delays, conditions).

**Signature**: `retryWhen(notifier: (errors: Observable) => Observable)`

**When to use**:
- Exponential backoff
- Conditional retry
- Custom retry strategies

**Example**:
```typescript
// Exponential backoff
this.http.get('/api/data').pipe(
  retryWhen(errors => errors.pipe(
    mergeMap((error, index) => {
      const retryAttempt = index + 1;
      if (retryAttempt > 3) {
        return throwError(() => error);
      }
      console.log(`Retry attempt ${retryAttempt}, waiting ${retryAttempt * 1000}ms`);
      return timer(retryAttempt * 1000);
    })
  ))
).subscribe(data => this.data = data);

// Conditional retry
this.http.get('/api/data').pipe(
  retryWhen(errors => errors.pipe(
    mergeMap(error => {
      if (error.status === 503) { // Service unavailable
        return timer(5000); // Retry after 5s
      }
      return throwError(() => error); // Don't retry other errors
    }),
    take(5)
  ))
).subscribe(data => this.data = data);
```

**Interview Note**: 
- More control than retry()
- Return Observable to retry
- Return error to give up
- Complex but powerful

---

### onErrorResumeNext()
**What it does**: Continues to next Observable even if previous errors.

**Signature**: `onErrorResumeNext(...observables)`

**When to use**:
- Best-effort operations
- Continue despite failures

**Example**:
```typescript
onErrorResumeNext(
  this.http.get('/api/data1'),
  this.http.get('/api/data2'),
  this.http.get('/api/data3')
).subscribe(data => console.log(data));
// Even if data1 fails, continues to data2, then data3
```

---

## 6. Utility Operators

### tap() / do()
**What it does**: Performs side effects without modifying the stream.

**Signature**: `tap(observer or next, error?, complete?)`

**When to use**:
- Logging/debugging
- Analytics tracking
- Side effects
- Debugging streams

**Example**:
```typescript
// Simple logging
this.http.get('/api/users').pipe(
  tap(data => console.log('Received:', data)),
  map(data => data.users),
  tap(users => console.log('Mapped to:', users))
).subscribe(users => this.users = users);

// Full observer
source$.pipe(
  tap({
    next: val => console.log('Next:', val),
    error: err => console.error('Error:', err),
    complete: () => console.log('Complete')
  })
).subscribe();

// Angular: Loading states and analytics
this.userService.loadUser(id).pipe(
  tap(() => this.loading = true),
  tap(user => this.analytics.track('user_loaded', user.id)),
  finalize(() => this.loading = false)
).subscribe(user => this.user = user);

// Debug complex chain
this.form.valueChanges.pipe(
  tap(val => console.log('1. Form value:', val)),
  debounceTime(300),
  tap(val => console.log('2. After debounce:', val)),
  distinctUntilChanged(),
  tap(val => console.log('3. After distinct:', val)),
  switchMap(val => this.validate(val))
).subscribe(result => console.log('4. Final result:', result));
```

**Interview Note**: 
- Does NOT modify stream values
- Perfect for debugging without breaking chain
- Use for side effects that don't affect data flow
- Original name was `do()` (deprecated)

---

### delay()
**What it does**: Delays emissions by specified time.

**Signature**: `delay(due: number | Date)`

**When to use**:
- Simulate network delays
- Timed operations
- Animation sequencing

**Example**:
```typescript
// Delay by milliseconds
of('Hello').pipe(
  delay(2000)
).subscribe(msg => console.log(msg)); // After 2 seconds

// Delay until date
of('Message').pipe(
  delay(new Date('2024-12-31'))
).subscribe();

// Angular: Delayed notification
this.saveSuccess$.pipe(
  delay(500),
  tap(() => this.showNotification('Saved!'))
).subscribe();

// Stagger animations
from([1, 2, 3]).pipe(
  concatMap(num => of(num).pipe(
    delay(num * 500),
    tap(n => this.animateItem(n))
  ))
).subscribe();
```

---

### delayWhen()
**What it does**: Delays each emission based on another Observable.

**Signature**: `delayWhen(delayDurationSelector)`

**When to use**:
- Dynamic delays
- Wait for events
- Conditional timing

**Example**:
```typescript
source$.pipe(
  delayWhen(val => timer(val * 1000))
).subscribe();

// Angular: Wait for initialization
this.userActions$.pipe(
  delayWhen(() => this.appInitialized$)
).subscribe(action => this.handleAction(action));
```

---

### timeout()
**What it does**: Errors if Observable doesn't emit within specified time.

**Signature**: `timeout(due: number | Date)`

**When to use**:
- Slow API detection
- SLA enforcement
- Prevent hanging

**Example**:
```typescript
this.http.get('/api/data').pipe(
  timeout(5000),
  catchError(error => {
    if (error.name === 'TimeoutError') {
      console.error('Request timed out');
      return of([]);
    }
    return throwError(() => error);
  })
).subscribe(data => this.data = data);

// Angular: User action timeout
this.waitingForInput$.pipe(
  timeout(30000),
  catchError(() => {
    this.showMessage('Are you still there?');
    return of(null);
  })
).subscribe();
```

---

### finalize()
**What it does**: Executes callback when Observable completes or errors (cleanup).

**Signature**: `finalize(callback: () => void)`

**When to use**:
- Cleanup operations
- Hide loading spinners
- Release resources
- Finally block equivalent

**Example**:
```typescript
// Always hide loader
this.http.get('/api/data').pipe(
  tap(() => this.loading = true),
  finalize(() => this.loading = false)
).subscribe({
  next: data => this.data = data,
  error: err => this.showError(err)
});

// Angular: Comprehensive cleanup
this.processData().pipe(
  tap(() => {
    this.loading = true;
    this.error = null;
  }),
  finalize(() => {
    this.loading = false;
    this.saveState();
    console.log('Operation completed or failed');
  })
).subscribe({
  next: result => this.result = result,
  error: err => this.error = err
});
```

**Interview Note**: 
- Runs on BOTH complete and error
- Like finally in try/catch
- Perfect for cleanup
- Runs AFTER unsubscribe

---

### repeat()
**What it does**: Resubscribes to source after it completes.

**Signature**: `repeat(count?: number)`

**When to use**:
- Polling that resets
- Retry successful operations

**Example**:
```typescript
// Repeat 3 times
of('Hello').pipe(
  repeat(3)
).subscribe(console.log); // Hello, Hello, Hello

// Infinite repeat
interval(1000).pipe(
  take(3),
  repeat() // Repeats indefinitely
).subscribe(console.log); // 0,1,2,0,1,2,0,1,2...
```

---

### timestamp()
**What it does**: Wraps each value with timestamp.

**Signature**: `timestamp(scheduler?)`

**When to use**:
- Track emission times
- Performance monitoring

**Example**:
```typescript
from([1, 2, 3]).pipe(
  timestamp()
).subscribe(console.log);
// {value: 1, timestamp: 1639234567890}
// {value: 2, timestamp: 1639234567891}
```

---

### timeInterval()
**What it does**: Emits time elapsed between emissions.

**Signature**: `timeInterval(scheduler?)`

**When to use**:
- Measure time between events
- Performance tracking

**Example**:
```typescript
interval(1000).pipe(
  take(3),
  timeInterval()
).subscribe(console.log);
// {value: 0, interval: 1000}
// {value: 1, interval: 1000}
```

---

## 7. Multicasting Operators

### share()
**What it does**: Shares a single subscription among multiple subscribers (multicast).

**Signature**: `share()`

**When to use**:
- Avoid duplicate HTTP requests
- Share expensive operations
- Convert cold to hot Observable

**Example**:
```typescript
// Without share - 2 HTTP requests
const data$ = this.http.get('/api/data');
data$.subscribe(d => console.log('Sub 1:', d));
data$.subscribe(d => console.log('Sub 2:', d));
// Makes 2 separate HTTP calls

// With share - 1 HTTP request
const shared$ = this.http.get('/api/data').pipe(share());
shared$.subscribe(d => console.log('Sub 1:', d));
shared$.subscribe(d => console.log('Sub 2:', d));
// Makes only 1 HTTP call, shares result

// Angular: Shared data service
@Injectable()
export class DataService {
  private data$ = this.http.get('/api/data').pipe(
    share()
  );
  
  getData() {
    return this.data$; // Multiple components share one request
  }
}
```

**Interview Note**: 
- Creates one subscription, multiple observers
- Resets when all subscribers unsubscribe
- New subscriber after completion triggers new subscription

---

### shareReplay()
**What it does**: Shares subscription AND replays N last values to new subscribers.

**Signature**: `shareReplay(bufferSize, windowTime?, scheduler?)`

**When to use**:
- Cache HTTP responses
- Share initialization data
- Late subscribers need past values

**Example**:
```typescript
// Cache user data
private user$ = this.http.get<User>('/api/user').pipe(
  shareReplay(1) // Cache last value
);

getUser() {
  return this.user$; // All subscribers get cached value
}

// Angular: Application config
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config$ = this.http.get('/api/config').pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true // Auto-cleanup when no subscribers
    })
  );
  
  getConfig() {
    return this.config$;
  }
}

// Multiple components
// Component 1
this.configService.getConfig().subscribe(config => {...});
// Component 2 (subscribes later)
this.configService.getConfig().subscribe(config => {...});
// Both get same cached result, only 1 HTTP call made
```

**Interview Note**: 
- Replays buffer to late subscribers
- Doesn't reset like share()
- Use bufferSize: 1 for caching
- refCount: true for memory cleanup
- Most common caching pattern in Angular

---

### publish() / multicast()
**What it does**: Converts cold Observable to hot, uses Subject internally.

**Signature**: `publish() then connect()`

**When to use**:
- Manual control over subscription timing
- Advanced multicasting scenarios

**Example**:
```typescript
const source$ = interval(1000).pipe(
  take(3),
  publish()
);

source$.subscribe(val => console.log('Sub 1:', val));
source$.subscribe(val => console.log('Sub 2:', val));

// Start emitting (only when ready)
const subscription = source$.connect();

// Later: subscription.unsubscribe();
```

**Interview Note**: Rarely used in modern Angular. Use `share()` or `shareReplay()` instead.

---

## 8. Common Angular Interview Patterns

### Pattern 1: Search with Debounce & Cancel
**The Classic Autocomplete Pattern**

```typescript
@Component({
  selector: 'app-search',
  template: `
    <input [formControl]="searchControl" placeholder="Search...">
    <div *ngFor="let result of results$ | async">{{result}}</div>
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  results$: Observable<any[]>;
  
  ngOnInit() {
    this.results$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),          // Wait 300ms after typing stops
      distinctUntilChanged(),     // Only if value changed
      filter(term => term.length >= 2), // Min 2 characters
      switchMap(term =>           // Cancel previous, start new search
        this.searchService.search(term).pipe(
          catchError(() => of([])) // Handle errors gracefully
        )
      )
    );
  }
}
```

**Why this pattern:**
- `debounceTime`: Prevents API spam while user types
- `distinctUntilChanged`: Skips duplicate searches
- `filter`: Avoids searching empty/short strings
- `switchMap`: Cancels outdated searches
- `catchError`: Graceful error handling

---

### Pattern 2: Component Unsubscribe (takeUntil)
**The Memory Leak Prevention Pattern**

```typescript
@Component({...})
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    // All subscriptions use takeUntil
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data = data);
    
    this.userService.getUser().pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => this.user = user);
    
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(tick => this.tick = tick);
  }
  
  ngOnDestroy() {
    this.destroy$.next();    // Trigger completion
    this.destroy$.complete(); // Clean up Subject
  }
}
```

**Why this pattern:**
- Single destroy$ for all subscriptions
- Automatic unsubscribe on component destroy
- Prevents memory leaks
- Clean and maintainable

**Alternative using Async Pipe (better):**
```typescript
@Component({
  template: `<div>{{data$ | async}}</div>`
})
export class MyComponent {
  // No manual subscription needed!
  data$ = this.dataService.getData();
}
```

---

### Pattern 3: Loading Multiple Resources (forkJoin)
**The Parallel Data Loading Pattern**

```typescript
@Component({...})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;
  
  ngOnInit() {
    this.loadData();
  }
  
  loadData() {
    this.loading = true;
    this.error = null;
    
    forkJoin({
      users: this.userService.getUsers(),
      posts: this.postService.getPosts(),
      comments: this.commentService.getComments(),
      stats: this.analyticsService.getStats()
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: ({users, posts, comments, stats}) => {
        this.users = users;
        this.posts = posts;
        this.comments = comments;
        this.stats = stats;
        this.initializeDashboard();
      },
      error: (error) => {
        this.error = 'Failed to load dashboard data';
        console.error(error);
      }
    });
  }
}
```

**Why this pattern:**
- Loads all resources in parallel
- Single loading state
- All-or-nothing approach
- finalize() handles both success/error

---

### Pattern 4: Form Validation (combineLatest)
**The Multi-Field Validation Pattern**

```typescript
@Component({...})
export class RegistrationComponent implements OnInit {
  emailControl = new FormControl('');
  passwordControl = new FormControl('');
  confirmControl = new FormControl('');
  termsControl = new FormControl(false);
  
  isValid$: Observable<boolean>;
  validationErrors$: Observable<string[]>;
  
  ngOnInit() {
    this.isValid$ = combineLatest([
      this.emailControl.valueChanges.pipe(startWith('')),
      this.passwordControl.valueChanges.pipe(startWith('')),
      this.confirmControl.valueChanges.pipe(startWith('')),
      this.termsControl.valueChanges.pipe(startWith(false))
    ]).pipe(
      map(([email, password, confirm, terms]) => {
        return this.isValidEmail(email) &&
               password.length >= 8 &&
               password === confirm &&
               terms === true;
      })
    );
    
    this.validationErrors$ = combineLatest([
      this.emailControl.valueChanges,
      this.passwordControl.valueChanges,
      this.confirmControl.valueChanges
    ]).pipe(
      map(([email, password, confirm]) => {
        const errors: string[] = [];
        if (!this.isValidEmail(email)) {
          errors.push('Invalid email');
        }
        if (password.length < 8) {
          errors.push('Password too short');
        }
        if (password !== confirm) {
          errors.push('Passwords do not match');
        }
        return errors;
      })
    );
  }
  
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

---

### Pattern 5: Optimistic Updates with Rollback
**The User-Friendly Update Pattern**

```typescript
@Component({...})
export class TodoComponent {
  todos$ = this.todoService.getTodos();
  
  toggleTodo(todo: Todo) {
    // Optimistic update
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.updateTodoLocally(updatedTodo);
    
    this.todoService.update(updatedTodo).pipe(
      catchError(error => {
        // Rollback on error
        this.updateTodoLocally(todo);
        this.showError('Update failed');
        return throwError(() => error);
      })
    ).subscribe();
  }
  
  updateTodoLocally(todo: Todo) {
    // Update local state immediately
    this.todos$ = this.todos$.pipe(
      map(todos => todos.map(t => 
        t.id === todo.id ? todo : t
      ))
    );
  }
}
```

---

### Pattern 6: Polling with Start/Stop
**The Controlled Polling Pattern**

```typescript
@Component({...})
export class StatusComponent implements OnInit {
  private polling$ = new Subject<boolean>();
  status$: Observable<Status>;
  
  ngOnInit() {
    this.status$ = this.polling$.pipe(
      switchMap(shouldPoll => 
        shouldPoll
          ? interval(5000).pipe(
              startWith(0),
              switchMap(() => this.statusService.getStatus())
            )
          : EMPTY
      )
    );
  }
  
  startPolling() {
    this.polling$.next(true);
  }
  
  stopPolling() {
    this.polling$.next(false);
  }
}
```

---

### Pattern 7: Retry with Exponential Backoff
**The Resilient API Call Pattern**

```typescript
@Injectable()
export class ApiService {
  getData() {
    return this.http.get('/api/data').pipe(
      retryWhen(errors => errors.pipe(
        mergeMap((error, index) => {
          const retryAttempt = index + 1;
          
          // Give up after 5 attempts
          if (retryAttempt > 5) {
            return throwError(() => error);
          }
          
          // Don't retry on 4xx errors (client errors)
          if (error.status >= 400 && error.status < 500) {
            return throwError(() => error);
          }
          
          // Exponential backoff: 1s, 2s, 4s, 8s, 16s
          const delayMs = Math.pow(2, retryAttempt) * 1000;
          console.log(`Retry attempt ${retryAttempt}, waiting ${delayMs}ms`);
          
          return timer(delayMs);
        })
      )),
      catchError(error => {
        console.error('All retry attempts failed', error);
        return of(null);
      })
    );
  }
}
```

---

### Pattern 8: Type-Ahead with Minimum Characters
**The Smart Search Pattern**

```typescript
@Component({...})
export class TypeAheadComponent {
  searchControl = new FormControl('');
  suggestions$: Observable<string[]>;
  
  ngOnInit() {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3), // Minimum 3 characters
      switchMap(term => 
        this.searchService.getSuggestions(term).pipe(
          catchError(() => of([])),
          startWith([]) // Clear previous results immediately
        )
      )
    );
  }
}
```

---

## 9. Operator Comparison Guide

### When to Use Which "Map" Operator?

| Operator | Behavior | Use When | Example |
|----------|----------|----------|---------|
| **map** | Transform values synchronously | Simple transformation, no Observables | Transform API response |
| **switchMap** | Cancel previous, use latest | Latest result matters, cancellable | Search, navigation |
| **mergeMap** | Run all concurrently | All results matter, order doesn't | Batch file uploads |
| **concatMap** | Run sequentially | Order matters, queue processing | Sequential API calls |
| **exhaustMap** | Ignore new while busy | Prevent duplicate actions | Form submit, login |

### switchMap vs mergeMap vs concatMap

```typescript
// Example: Processing IDs [1, 2, 3]

// switchMap - Latest wins, cancels previous
from([1, 2, 3]).pipe(
  switchMap(id => this.http.get(`/api/${id}`))
)
// If 3 arrives while 1 is loading, 1 and 2 are cancelled
// Result: Only gets data for ID 3

// mergeMap - All run concurrently
from([1, 2, 3]).pipe(
  mergeMap(id => this.http.get(`/api/${id}`))
)
// All 3 requests run simultaneously
// Result: Gets all 3, order may vary

// concatMap - Sequential, waits for each
from([1, 2, 3]).pipe(
  concatMap(id => this.http.get(`/api/${id}`))
)
// Request 2 waits for 1, request 3 waits for 2
// Result: Gets all 3, in order 1, 2, 3

// exhaustMap - Ignores new while busy
from([1, 2, 3]).pipe(
  exhaustMap(id => this.http.get(`/api/${id}`))
)
// If 2 and 3 arrive while 1 is loading, they're ignored
// Result: Only gets data for ID 1
```

### debounceTime vs throttleTime vs auditTime

```typescript
// User typing: a-b-c-d-e (50ms apart)

// debounceTime(200) - Wait for pause
// Emits: 'e' (after 200ms of silence)
// Use: Search input

// throttleTime(200) - Emit first, block for duration
// Emits: 'a', then after 200ms can emit again
// Use: Scroll events, rate limiting

// auditTime(200) - Emit last after duration
// Emits: Last value in each 200ms window
// Use: Similar to throttle but want latest value

fromEvent(input, 'keyup').pipe(
  // Pick one based on need:
  debounceTime(300)  // ✓ Search: wait for pause
  // throttleTime(300)  // ✓ Scroll: rate limit
  // auditTime(300)     // ✓ Latest value periodically
)
```

### combineLatest vs forkJoin vs withLatestFrom

```typescript
const a$ = interval(100).pipe(take(3)); // 0, 1, 2
const b$ = interval(150).pipe(take(3)); // 0, 1, 2

// combineLatest - Emits when ANY emits (after all emit once)
combineLatest([a$, b$])
// Emits: [0,0], [1,0], [1,1], [2,1], [2,2]
// Use: Form validation, reactive calculations

// forkJoin - Emits ONCE when ALL complete
forkJoin([a$, b$])
// Emits: [2, 2] (only at the end)
// Use: Parallel HTTP requests, wait for all

// withLatestFrom - Emits when source emits
a$.pipe(withLatestFrom(b$))
// Emits: [0,0], [1,0], [2,1]
// Only emits when a$ emits, uses latest b$
// Use: Add context to primary stream
```

### merge vs concat vs zip

```typescript
const a$ = of(1, 2, 3);
const b$ = of('a', 'b', 'c');

// merge - Interleave all emissions
merge(a$, b$)
// Output: 1, 2, 3, 'a', 'b', 'c' (order may vary)

// concat - Sequential (one after another)
concat(a$, b$)
// Output: 1, 2, 3, 'a', 'b', 'c' (guaranteed order)

// zip - Pair by index
zip(a$, b$)
// Output: [1,'a'], [2,'b'], [3,'c']
```

### share vs shareReplay

```typescript
// share - No replay, resets when all unsubscribe
const shared$ = this.http.get('/api').pipe(share());
sub1 = shared$.subscribe(); // Makes HTTP call
sub2 = shared$.subscribe(); // Shares same call
sub1.unsubscribe();
sub2.unsubscribe();
sub3 = shared$.subscribe(); // Makes NEW HTTP call

// shareReplay - Replays to late subscribers, never resets
const cached$ = this.http.get('/api').pipe(
  shareReplay(1)
);
sub1 = cached$.subscribe(); // Makes HTTP call
sub2 = cached$.subscribe(); // Gets cached value
sub1.unsubscribe();
sub2.unsubscribe();
sub3 = cached$.subscribe(); // Still gets cached value (no new call)
```

### take vs first vs takeUntil

```typescript
// take(n) - First n emissions
source$.pipe(take(3)) // Takes first 3

// first() - First emission only (can filter)
source$.pipe(first()) // Takes very first
source$.pipe(first(x => x > 5)) // First that matches

// takeUntil(notifier) - Until notifier emits
source$.pipe(
  takeUntil(destroy$)
) // Unsubscribe pattern
```

---

## 10. Interview Tips & Tricks

### Common Interview Questions

**Q1: What's the difference between hot and cold Observables?**

**Answer:**
- **Cold**: Creates new execution for each subscriber (unicast)
  - Examples: HTTP calls, Promises converted to Observables
  - Each subscriber triggers the producer independently
  ```typescript
  const cold$ = this.http.get('/api/data');
  cold$.subscribe(); // Makes HTTP call
  cold$.subscribe(); // Makes ANOTHER HTTP call
  ```

- **Hot**: Shares execution among subscribers (multicast)
  - Examples: DOM events, Subjects, shared Observables
  - Producer exists independently of subscribers
  ```typescript
  const hot$ = fromEvent(button, 'click');
  hot$.subscribe(); // Listens to existing clicks
  hot$.subscribe(); // Also listens to same clicks
  ```

**Convert cold to hot:**
```typescript
const hot$ = cold$.pipe(share());
```

---

**Q2: Explain the difference between Subject, BehaviorSubject, and ReplaySubject**

**Answer:**

| Type | Description | Initial Value | Replay |
|------|-------------|---------------|--------|
| **Subject** | Basic Subject, no initial value, no replay | No | No |
| **BehaviorSubject** | Requires initial value, replays latest | Yes | 1 |
| **ReplaySubject** | No initial value, replays N values | No | N |
| **AsyncSubject** | Only emits last value on complete | No | 1 (on complete) |

```typescript
// Subject - No replay
const subject = new Subject<number>();
subject.next(1);
subject.subscribe(val => console.log(val)); // Nothing
subject.next(2); // Logs: 2

// BehaviorSubject - Replays latest (requires initial)
const behavior = new BehaviorSubject<number>(0);
behavior.next(1);
behavior.subscribe(val => console.log(val)); // Logs: 1
behavior.next(2); // Logs: 2

// ReplaySubject - Replays last N values
const replay = new ReplaySubject<number>(2);
replay.next(1);
replay.next(2);
replay.next(3);
replay.subscribe(val => console.log(val)); // Logs: 2, 3
```

**Angular Use Cases:**
- **Subject**: Event bus, notifications
- **BehaviorSubject**: Current state (logged in user, current page)
- **ReplaySubject**: Caching, late subscribers need history

---

**Q3: How do you prevent memory leaks in Angular components?**

**Answer:**

**Method 1: takeUntil (Recommended)**
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

**Method 2: Async Pipe (Best)**
```typescript
// Template
data$ = this.service.getData();
// In template: {{ data$ | async }}
// No manual unsubscribe needed!
```

**Method 3: Manual Subscription Storage**
```typescript
private subscriptions = new Subscription();

ngOnInit() {
  this.subscriptions.add(
    this.service.data$.subscribe(...)
  );
}

ngOnDestroy() {
  this.subscriptions.unsubscribe();
}
```

---

**Q4: When would you use switchMap vs mergeMap?**

**Answer:**

**Use switchMap when:**
- Latest result matters, cancel previous
- Search/autocomplete
- Navigation (route changes)
- User typing
```typescript
// Search - cancel old searches
searchTerm$.pipe(
  switchMap(term => this.search(term))
)
```

**Use mergeMap when:**
- All results matter
- Concurrent operations
- Order doesn't matter
```typescript
// Upload multiple files
from(files).pipe(
  mergeMap(file => this.upload(file))
)
```

**Use concatMap when:**
- Order matters
- Sequential processing
```typescript
// Process queue in order
from(tasks).pipe(
  concatMap(task => this.process(task))
)
```

**Use exhaustMap when:**
- Ignore new while busy
- Prevent duplicates
```typescript
// Login button - ignore spam clicks
loginButton$.pipe(
  exhaustMap(() => this.login())
)
```

---

**Q5: How do you handle errors in Observable chains?**

**Answer:**

**Local error handling (within pipe):**
```typescript
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    return of([]); // Fallback value
  })
).subscribe(data => this.data = data);
```

**Global error handling (at subscribe):**
```typescript
this.http.get('/api/data').subscribe({
  next: data => this.data = data,
  error: error => this.handleError(error),
  complete: () => console.log('Done')
});
```

**Retry with backoff:**
```typescript
this.http.get('/api/data').pipe(
  retry(3),
  catchError(error => {
    this.showError('Failed after 3 retries');
    return of([]);
  })
).subscribe(data => this.data = data);
```

---

**Q6: What's the purpose of shareReplay and when would you use it?**

**Answer:**

**Purpose**: Cache HTTP responses and share among subscribers.

```typescript
// Without shareReplay - Multiple HTTP calls
private getUserData() {
  return this.http.get<User>('/api/user');
}

ngOnInit() {
  this.getUserData().subscribe(user => this.user = user);
  this.getUserData().subscribe(user => this.userName = user.name);
  // Makes 2 HTTP requests!
}

// With shareReplay - Single HTTP call
private user$ = this.http.get<User>('/api/user').pipe(
  shareReplay(1)
);

ngOnInit() {
  this.user$.subscribe(user => this.user = user);
  this.user$.subscribe(user => this.userName = user.name);
  // Makes only 1 HTTP request, shares result
}
```

**Use Cases:**
- Cache user profile
- Cache application config
- Share expensive computations
- Reference data that doesn't change often

---

### Performance Considerations

1. **Use trackBy in *ngFor with Observables**
```typescript
// Template
<div *ngFor="let item of items$ | async; trackBy: trackById">

// Component
trackById(index: number, item: any) {
  return item.id;
}
```

2. **Unsubscribe from finite vs infinite streams**
```typescript
// HTTP calls complete automatically - no unsubscribe needed
this.http.get('/api/data').subscribe(...);

// Infinite streams MUST be unsubscribed
interval(1000).pipe(
  takeUntil(this.destroy$)
).subscribe(...);
```

3. **Avoid nested subscriptions (subscribe inside subscribe)**
```typescript
// ❌ Bad - Nested subscriptions
this.service1.getData().subscribe(data1 => {
  this.service2.getData(data1).subscribe(data2 => {
    // Nested hell
  });
});

// ✅ Good - Use switchMap
this.service1.getData().pipe(
  switchMap(data1 => this.service2.getData(data1))
).subscribe(data2 => {
  // Clean and flat
});
```

4. **Use shareReplay for expensive operations**
```typescript
// ❌ Bad - Recalculates for each subscriber
getExpensiveData() {
  return this.http.get('/api/data').pipe(
    map(data => this.expensiveTransform(data))
  );
}

// ✅ Good - Calculate once, share result
private expensiveData$ = this.http.get('/api/data').pipe(
  map(data => this.expensiveTransform(data)),
  shareReplay(1)
);

getExpensiveData() {
  return this.expensiveData$;
}
```

---

### Common Pitfalls

**1. Not unsubscribing from infinite streams**
```typescript
// ❌ Memory leak
ngOnInit() {
  interval(1000).subscribe(...);
}

// ✅ Proper cleanup
ngOnInit() {
  interval(1000).pipe(
    takeUntil(this.destroy$)
  ).subscribe(...);
}
```

**2. Using nested subscriptions instead of operators**
```typescript
// ❌ Callback hell
this.getUser().subscribe(user => {
  this.getPosts(user.id).subscribe(posts => {
    this.getComments(posts[0].id).subscribe(comments => {
      // Deeply nested
    });
  });
});

// ✅ Flat and readable
this.getUser().pipe(
  switchMap(user => this.getPosts(user.id)),
  switchMap(posts => this.getComments(posts[0].id))
).subscribe(comments => {
  // Clean!
});
```

**3. Not handling errors in chains**
```typescript
// ❌ Error breaks entire stream
source$.pipe(
  switchMap(val => this.http.get(`/api/${val}`))
).subscribe(...);

// ✅ Handle errors gracefully
source$.pipe(
  switchMap(val => this.http.get(`/api/${val}`).pipe(
    catchError(() => of(null))
  ))
).subscribe(...);
```

**4. Subscribing multiple times to cold Observables**
```typescript
// ❌ Makes 3 HTTP calls
const data$ = this.http.get('/api/data');
data$.subscribe(d => this.data1 = d);
data$.subscribe(d => this.data2 = d);
data$.subscribe(d => this.data3 = d);

// ✅ Make 1 HTTP call
const data$ = this.http.get('/api/data').pipe(share());
data$.subscribe(d => this.data1 = d);
data$.subscribe(d => this.data2 = d);
data$.subscribe(d => this.data3 = d);
```

**5. Using Subject instead of BehaviorSubject for state**
```typescript
// ❌ New subscribers miss current state
private userSubject = new Subject<User>();
user$ = this.userSubject.asObservable();

// ✅ New subscribers get current state
private userSubject = new BehaviorSubject<User>(null);
user$ = this.userSubject.asObservable();
```

---

### Quick Reference Cheat Sheet

**Creating Observables**
```typescript
of(1, 2, 3)              // Static values
from([1, 2, 3])          // From array/promise
interval(1000)           // Every 1 second
timer(3000)              // After 3 seconds
fromEvent(el, 'click')   // DOM events
```

**Transforming**
```typescript
map(x => x * 2)          // Transform value
switchMap(x => obs$)     // Cancel previous
mergeMap(x => obs$)      // All concurrent
concatMap(x => obs$)     // Sequential
exhaustMap(x => obs$)    // Ignore while busy
scan((acc, x) => acc + x) // Accumulate
```

**Filtering**
```typescript
filter(x => x > 5)       // Conditional
debounceTime(300)        // Wait for pause
throttleTime(1000)       // Rate limit
distinctUntilChanged()   // Skip duplicates
take(5)                  // First 5
takeUntil(notifier$)     // Until signal
first()                  // First value only
```

**Combining**
```typescript
combineLatest([a$, b$])  // Latest from all
forkJoin([a$, b$])       // Wait for all complete
merge(a$, b$)            // Interleave
concat(a$, b$)           // Sequential
zip(a$, b$)              // Pair by index
withLatestFrom(b$)       // Context to primary
```

**Error Handling**
```typescript
catchError(() => of([]))  // Fallback
retry(3)                  // Retry count
retryWhen(errors$ => ...)  // Custom retry
```

**Utility**
```typescript
tap(val => console.log(val)) // Side effects
delay(1000)                   // Delay emissions
finalize(() => cleanup())     // Cleanup
timeout(5000)                 // Timeout
```

**Multicasting**
```typescript
share()                  // Share subscription
shareReplay(1)           // Cache and share
```

---

## Summary: Most Important for Interviews

**Top 10 Must-Know Operators:**
1. **map** - Transform data
2. **switchMap** - Cancel previous (search, navigation)
3. **mergeMap** - Concurrent operations
4. **combineLatest** - Reactive forms, multiple sources
5. **forkJoin** - Parallel HTTP requests
6. **debounceTime** - Search input
7. **takeUntil** - Unsubscribe pattern
8. **catchError** - Error handling
9. **tap** - Debugging, side effects
10. **shareReplay** - Caching

**Key Concepts to Master:**
- Hot vs Cold Observables
- Subject types and when to use each
- Memory leak prevention (takeUntil, async pipe)
- Error handling strategies
- When to use which "map" operator
- Difference between combineLatest and forkJoin

**Practice Scenarios:**
- Build a search with autocomplete
- Implement form validation
- Create a data service with caching
- Handle file uploads with progress
- Implement retry logic with backoff
- Build a polling mechanism

---

Ready for deep dive questions! 🚀
