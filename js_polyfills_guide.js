// ============================================
// ADVANCED JAVASCRIPT POLYFILLS & IMPLEMENTATIONS
// For Senior Frontend Engineers (8+ Years Experience)
// ============================================

// ============================================
// 1. ARRAY METHODS POLYFILLS
// ============================================

// 1.1 Array.prototype.map()
if (!Array.prototype.myMap) {
  Array.prototype.myMap = function(callback, thisArg) {
    // Handle null/undefined
    if (this == null) {
      throw new TypeError('Array.prototype.map called on null or undefined');
    }
    
    // Ensure callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    const O = Object(this);
    const len = O.length >>> 0; // Convert to unsigned 32-bit integer
    const result = new Array(len);
    
    for (let i = 0; i < len; i++) {
      // Check if property exists (sparse arrays)
      if (i in O) {
        result[i] = callback.call(thisArg, O[i], i, O);
      }
    }
    
    return result;
  };
}

// Usage
console.log([1, 2, 3].myMap(x => x * 2)); // [2, 4, 6]


// 1.2 Array.prototype.reduce()
if (!Array.prototype.myReduce) {
  Array.prototype.myReduce = function(callback, initialValue) {
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    const O = Object(this);
    const len = O.length >>> 0;
    
    let k = 0;
    let accumulator;
    
    // If initialValue provided
    if (arguments.length >= 2) {
      accumulator = initialValue;
    } else {
      // Find first existing element
      while (k < len && !(k in O)) {
        k++;
      }
      
      // Empty array with no initial value
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      
      accumulator = O[k++];
    }
    
    // Iterate through array
    while (k < len) {
      if (k in O) {
        accumulator = callback(accumulator, O[k], k, O);
      }
      k++;
    }
    
    return accumulator;
  };
}

// Usage
console.log([1, 2, 3, 4].myReduce((acc, val) => acc + val, 0)); // 10


// 1.3 Array.prototype.filter()
if (!Array.prototype.myFilter) {
  Array.prototype.myFilter = function(callback, thisArg) {
    if (this == null) {
      throw new TypeError('Array.prototype.filter called on null or undefined');
    }
    
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    const O = Object(this);
    const len = O.length >>> 0;
    const result = [];
    
    for (let i = 0; i < len; i++) {
      if (i in O) {
        const val = O[i];
        if (callback.call(thisArg, val, i, O)) {
          result.push(val);
        }
      }
    }
    
    return result;
  };
}

// Usage
console.log([1, 2, 3, 4, 5].myFilter(x => x > 2)); // [3, 4, 5]


// 1.4 Array.prototype.forEach()
if (!Array.prototype.myForEach) {
  Array.prototype.myForEach = function(callback, thisArg) {
    if (this == null) {
      throw new TypeError('Array.prototype.forEach called on null or undefined');
    }
    
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    const O = Object(this);
    const len = O.length >>> 0;
    
    for (let i = 0; i < len; i++) {
      if (i in O) {
        callback.call(thisArg, O[i], i, O);
      }
    }
    
    // forEach returns undefined
    return undefined;
  };
}

// Usage
[1, 2, 3].myForEach((val, idx) => console.log(`${idx}: ${val}`));


// 1.5 Array.prototype.find()
if (!Array.prototype.myFind) {
  Array.prototype.myFind = function(callback, thisArg) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    const O = Object(this);
    const len = O.length >>> 0;
    
    for (let i = 0; i < len; i++) {
      if (i in O) {
        const val = O[i];
        if (callback.call(thisArg, val, i, O)) {
          return val;
        }
      }
    }
    
    return undefined;
  };
}

// Usage
console.log([1, 2, 3, 4].myFind(x => x > 2)); // 3


// ============================================
// 2. FUNCTION METHODS POLYFILLS
// ============================================

// 2.1 Function.prototype.call()
if (!Function.prototype.myCall) {
  Function.prototype.myCall = function(context, ...args) {
    // Handle null/undefined context
    context = context || globalThis;
    
    // Ensure context is an object
    if (typeof context !== 'object') {
      context = Object(context);
    }
    
    // Create unique symbol to avoid property collision
    const fnSymbol = Symbol('fn');
    
    // Temporarily add function to context
    context[fnSymbol] = this;
    
    // Execute function with context
    const result = context[fnSymbol](...args);
    
    // Clean up
    delete context[fnSymbol];
    
    return result;
  };
}

// Usage
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: 'John' };
console.log(greet.myCall(person, 'Hello', '!')); // "Hello, John!"


// 2.2 Function.prototype.apply()
if (!Function.prototype.myApply) {
  Function.prototype.myApply = function(context, argsArray) {
    context = context || globalThis;
    
    if (typeof context !== 'object') {
      context = Object(context);
    }
    
    // Validate argsArray
    if (argsArray !== null && argsArray !== undefined) {
      if (!Array.isArray(argsArray) && typeof argsArray !== 'object') {
        throw new TypeError('CreateListFromArrayLike called on non-object');
      }
    }
    
    const fnSymbol = Symbol('fn');
    context[fnSymbol] = this;
    
    const args = argsArray || [];
    const result = context[fnSymbol](...args);
    
    delete context[fnSymbol];
    
    return result;
  };
}

// Usage
console.log(greet.myApply(person, ['Hi', '!!'])); // "Hi, John!!"


// 2.3 Function.prototype.bind()
if (!Function.prototype.myBind) {
  Function.prototype.myBind = function(context, ...boundArgs) {
    const fn = this;
    
    if (typeof fn !== 'function') {
      throw new TypeError('Bind must be called on a function');
    }
    
    // Return bound function
    const boundFunction = function(...newArgs) {
      // If called with 'new', use new instance as context
      const isConstructorCall = this instanceof boundFunction;
      const finalContext = isConstructorCall ? this : context;
      
      return fn.apply(finalContext, [...boundArgs, ...newArgs]);
    };
    
    // Maintain prototype chain for constructor calls
    if (fn.prototype) {
      boundFunction.prototype = Object.create(fn.prototype);
    }
    
    return boundFunction;
  };
}

// Usage
const boundGreet = greet.myBind(person, 'Hey');
console.log(boundGreet('?')); // "Hey, John?"


// ============================================
// 3. PROMISE POLYFILLS
// ============================================

// 3.1 Basic Promise Implementation
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      }
    };
    
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn(reason));
      }
    };
    
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };
    
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      
      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    
    return promise2;
  }
  
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  
  finally(onFinally) {
    return this.then(
      value => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
    );
  }
  
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise(resolve => resolve(value));
  }
  
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected'));
  }
  
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}


// 3.2 Promise.all()
if (!Promise.myAll) {
  Promise.myAll = function(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      
      if (promises.length === 0) {
        return resolve([]);
      }
      
      const results = [];
      let completedCount = 0;
      
      promises.forEach((promise, index) => {
        Promise.resolve(promise)
          .then(value => {
            results[index] = value;
            completedCount++;
            
            if (completedCount === promises.length) {
              resolve(results);
            }
          })
          .catch(error => {
            reject(error); // Reject on first error
          });
      });
    });
  };
}

// Usage
Promise.myAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]


// 3.3 Promise.race()
if (!Promise.myRace) {
  Promise.myRace = function(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      
      if (promises.length === 0) {
        return; // Never settles
      }
      
      promises.forEach(promise => {
        Promise.resolve(promise)
          .then(resolve)  // First to resolve wins
          .catch(reject); // First to reject wins
      });
    });
  };
}

// Usage
Promise.myRace([
  new Promise(resolve => setTimeout(() => resolve('fast'), 100)),
  new Promise(resolve => setTimeout(() => resolve('slow'), 500))
]).then(console.log); // "fast"


// 3.4 Promise.allSettled()
if (!Promise.myAllSettled) {
  Promise.myAllSettled = function(promises) {
    return new Promise((resolve) => {
      if (!Array.isArray(promises)) {
        return resolve([]);
      }
      
      if (promises.length === 0) {
        return resolve([]);
      }
      
      const results = [];
      let settledCount = 0;
      
      promises.forEach((promise, index) => {
        Promise.resolve(promise)
          .then(value => {
            results[index] = { status: 'fulfilled', value };
            settledCount++;
            
            if (settledCount === promises.length) {
              resolve(results);
            }
          })
          .catch(reason => {
            results[index] = { status: 'rejected', reason };
            settledCount++;
            
            if (settledCount === promises.length) {
              resolve(results);
            }
          });
      });
    });
  };
}

// Usage
Promise.myAllSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(console.log);
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]


// 3.5 Promise.any()
if (!Promise.myAny) {
  Promise.myAny = function(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      
      if (promises.length === 0) {
        return reject(new AggregateError([], 'All promises were rejected'));
      }
      
      const errors = [];
      let rejectedCount = 0;
      
      promises.forEach((promise, index) => {
        Promise.resolve(promise)
          .then(value => {
            resolve(value); // First fulfilled promise wins
          })
          .catch(error => {
            errors[index] = error;
            rejectedCount++;
            
            if (rejectedCount === promises.length) {
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          });
      });
    });
  };
}

// Usage
Promise.myAny([
  Promise.reject('error1'),
  Promise.resolve('success'),
  Promise.reject('error2')
]).then(console.log); // "success"


// ============================================
// 4. MAP LIMIT (Concurrent Async Operations)
// ============================================

async function mapLimit(array, limit, asyncFunction) {
  const results = [];
  const executing = [];
  
  for (const [index, item] of array.entries()) {
    // Create promise for current item
    const promise = Promise.resolve().then(() => asyncFunction(item, index));
    results.push(promise);
    
    // Don't await if limit not reached
    if (limit <= array.length) {
      const executing = promise.then(() => 
        executing.splice(executing.indexOf(executing), 1)
      );
      executing.push(executing);
      
      // Wait if we've reached the limit
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  
  return Promise.all(results);
}

// Better implementation with worker pattern
async function mapLimitOptimized(array, limit, asyncFn) {
  const results = new Array(array.length);
  const iterator = array.entries();
  
  async function worker() {
    for (const [index, item] of iterator) {
      results[index] = await asyncFn(item, index);
    }
  }
  
  // Create workers up to limit
  const workers = Array(Math.min(limit, array.length))
    .fill()
    .map(() => worker());
  
  await Promise.all(workers);
  return results;
}

// Usage
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
mapLimitOptimized(urls, 2, async (url) => {
  const response = await fetch(url);
  return response.json();
}).then(console.log);


// ============================================
// 5. DEBOUNCE
// ============================================

function debounce(func, delay, options = {}) {
  let timeoutId;
  const { immediate = false } = options;
  
  return function debounced(...args) {
    const context = this;
    
    const later = () => {
      timeoutId = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, delay);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

// Advanced debounce with cancel and flush
function debounceAdvanced(func, delay, options = {}) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  const { leading = false, trailing = true, maxWait } = options;
  let lastCallTime;
  let lastInvokeTime = 0;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    return func.apply(thisArg, args);
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }
  
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    
    const timeSinceLastCall = time - lastCallTime;
    const timeWaiting = delay - timeSinceLastCall;
    
    timeoutId = setTimeout(
      timerExpired,
      maxWait !== undefined
        ? Math.min(timeWaiting, maxWait - (time - lastInvokeTime))
        : timeWaiting
    );
  }
  
  function trailingEdge(time) {
    timeoutId = undefined;
    
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return undefined;
  }
  
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, delay);
    return leading ? invokeFunc(time) : undefined;
  }
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait) {
        timeoutId = setTimeout(timerExpired, delay);
        return invokeFunc(lastCallTime);
      }
    }
    
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, delay);
    }
    
    return undefined;
  }
  
  debounced.cancel = function() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = undefined;
  };
  
  debounced.flush = function() {
    return timeoutId === undefined ? undefined : trailingEdge(Date.now());
  };
  
  debounced.pending = function() {
    return timeoutId !== undefined;
  };
  
  return debounced;
}

// Usage
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query);
}, 500);


// ============================================
// 6. THROTTLE
// ============================================

function throttle(func, delay, options = {}) {
  let timeoutId;
  let lastRan;
  const { leading = true, trailing = true } = options;
  
  return function throttled(...args) {
    const context = this;
    
    if (!lastRan && !leading) {
      lastRan = Date.now();
    }
    
    const invokeFunc = () => {
      lastRan = Date.now();
      timeoutId = null;
      func.apply(context, args);
    };
    
    const timeSinceLastRan = Date.now() - (lastRan || 0);
    const remaining = delay - timeSinceLastRan;
    
    if (remaining <= 0 || remaining > delay) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      invokeFunc();
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(invokeFunc, remaining);
    }
  };
}

// Advanced throttle with cancel
function throttleAdvanced(func, delay, options = {}) {
  let timeoutId;
  let lastCallTime = 0;
  let lastThis;
  let lastArgs;
  const { leading = true, trailing = true } = options;
  
  function invokeFunc() {
    lastCallTime = Date.now();
    timeoutId = null;
    func.apply(lastThis, lastArgs);
    lastArgs = lastThis = null;
  }
  
  function shouldInvoke(time) {
    return time - lastCallTime >= delay;
  }
  
  function throttled(...args) {
    const time = Date.now();
    lastThis = this;
    lastArgs = args;
    
    const isInvoking = shouldInvoke(time);
    
    if (isInvoking) {
      if (!timeoutId && leading) {
        invokeFunc();
        return;
      }
    }
    
    if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        invokeFunc();
      }, delay - (time - lastCallTime));
    }
  }
  
  throttled.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = 0;
    lastArgs = lastThis = null;
  };
  
  return throttled;
}

// Usage
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 1000);


// ============================================
// 7. EVENT EMITTER
// ============================================

class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(listener);
    return this;
  }
  
  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, onceWrapper);
    };
    
    onceWrapper.listener = listener;
    this.on(event, onceWrapper);
    return this;
  }
  
  off(event, listenerToRemove) {
    if (!this.events[event]) {
      return this;
    }
    
    this.events[event] = this.events[event].filter(listener => {
      return listener !== listenerToRemove && listener.listener !== listenerToRemove;
    });
    
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
    
    return this;
  }
  
  emit(event, ...args) {
    if (!this.events[event]) {
      return false;
    }
    
    // Create a copy to avoid issues if listeners are removed during emit
    const listeners = [...this.events[event]];
    
    listeners.forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
    
    return true;
  }
  
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
  
  listenerCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }
  
  listeners(event) {
    return this.events[event] ? [...this.events[event]] : [];
  }
}

// Usage
const emitter = new EventEmitter();
emitter.on('data', (data) => console.log('Data:', data));
emitter.emit('data', { message: 'Hello' });


// ============================================
// 8. SETINTERVAL POLYFILL USING SETTIMEOUT
// ============================================

function mySetInterval(callback, delay, ...args) {
  let timeoutId;
  let count = 0;
  
  const interval = () => {
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
      count++;
      interval();
    }, delay);
  };
  
  interval();
  
  return {
    clear: () => clearTimeout(timeoutId),
    count: () => count
  };
}

// Advanced with pause/resume
function mySetIntervalAdvanced(callback, delay, ...args) {
  let timeoutId;
  let count = 0;
  let isPaused = false;
  let startTime = Date.now();
  let remaining = delay;
  
  const interval = () => {
    if (isPaused) return;
    
    startTime = Date.now();
    timeoutId = setTimeout(() => {
      if (!isPaused) {
        callback.apply(this, args);
        count++;
        remaining = delay;
        interval();
      }
    }, remaining);
  };
  
  interval();
  
  return {
    clear: () => {
      clearTimeout(timeoutId);
      timeoutId = null;
    },
    pause: () => {
      if (!isPaused && timeoutId) {
        clearTimeout(timeoutId);
        isPaused = true;
        remaining -= Date.now() - startTime;
      }
    },
    resume: () => {
      if (isPaused) {
        isPaused = false;
        interval();
      }
    },
    count: () => count
  };
}

// Usage
const interval = mySetIntervalAdvanced(() => {
  console.log('Tick');
}, 1000);

// Later: interval.pause();
// Later: interval.resume();
// Later: interval.clear();


// ============================================
// 9. PARALLEL LIMIT FUNCTION
// ============================================

async function parallelLimit(tasks, limit) {
  const results = [];
  const executing = new Set();
  
  for (const [index, task] of tasks.entries()) {
    const promise = Promise.resolve().then(() => task());
    results.push(promise);
    
    const executing = promise.then(() => executing.delete(executing));
    executing.add(executing);
    
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// Better implementation
async function parallelLimitOptimized(tasks, limit) {
  const results = new Array(tasks.length);
  const iterator = tasks.entries();
  let completed = 0;
  
  async function worker() {
    for (const [index, task] of iterator) {
      try {
        results[index] = await task();
        completed++;
        if (onProgress) {
          onProgress(completed, tasks.length);
        }
      } catch (error) {
        results[index] = { error };
        completed++;
        if (onProgress) {
          onProgress(completed, tasks.length);
        }
      }
    }
  }
  
  const workers = Array(Math.min(limit, tasks.length))
    .fill()
    .map(() => worker());
  
  await Promise.all(workers);
  return results;
}

// Usage
const tasks = [
  () => fetch('/api/1').then(r => r.json()),
  () => fetch('/api/2').then(r => r.json()),
  () => fetch('/api/3').then(r => r.json()),
  () => fetch('/api/4').then(r => r.json()),
];

parallelLimitWithProgress(tasks, 2, (completed, total) => {
  console.log(`Progress: ${completed}/${total}`);
}).then(console.log);


// ============================================
// 10. DEEP VS SHALLOW COPY
// ============================================

// 10.1 Shallow Copy
function shallowCopy(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return [...obj];
  }
  
  return { ...obj };
}

// Alternative shallow copy methods
const shallowCopyMethods = {
  // Object.assign
  method1: (obj) => Object.assign({}, obj),
  
  // Spread operator
  method2: (obj) => ({ ...obj }),
  
  // Array methods
  arraySlice: (arr) => arr.slice(),
  arrayConcat: (arr) => [].concat(arr),
  arraySpread: (arr) => [...arr],
  
  // Array.from
  arrayFrom: (arr) => Array.from(arr)
};


// 10.2 Deep Copy
function deepCopy(obj, hash = new WeakMap()) {
  // Handle null and primitives
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    const arrCopy = [];
    hash.set(obj, arrCopy);
    obj.forEach((item, index) => {
      arrCopy[index] = deepCopy(item, hash);
    });
    return arrCopy;
  }
  
  // Handle Map
  if (obj instanceof Map) {
    const mapCopy = new Map();
    hash.set(obj, mapCopy);
    obj.forEach((value, key) => {
      mapCopy.set(deepCopy(key, hash), deepCopy(value, hash));
    });
    return mapCopy;
  }
  
  // Handle Set
  if (obj instanceof Set) {
    const setCopy = new Set();
    hash.set(obj, setCopy);
    obj.forEach(value => {
      setCopy.add(deepCopy(value, hash));
    });
    return setCopy;
  }
  
  // Handle Object
  const objCopy = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, objCopy);
  
  // Copy all properties including non-enumerable
  Object.getOwnPropertyNames(obj).forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor.value !== undefined) {
      descriptor.value = deepCopy(descriptor.value, hash);
    }
    Object.defineProperty(objCopy, key, descriptor);
  });
  
  // Copy symbols
  Object.getOwnPropertySymbols(obj).forEach(symbol => {
    objCopy[symbol] = deepCopy(obj[symbol], hash);
  });
  
  return objCopy;
}

// Simpler deep copy (without all edge cases)
function deepCopySimple(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (cache.has(obj)) return cache.get(obj);
  
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  
  const copy = Array.isArray(obj) ? [] : {};
  cache.set(obj, copy);
  
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopySimple(obj[key], cache);
  });
  
  return copy;
}

// Using JSON (limitations: loses functions, dates become strings, circular refs fail)
function deepCopyJSON(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('JSON deep copy failed:', error);
    return null;
  }
}

// Usage examples
const original = {
  name: 'John',
  nested: { age: 30 },
  arr: [1, 2, { value: 3 }],
  date: new Date(),
  regex: /test/gi,
  func: () => console.log('hi')
};

const deepCopied = deepCopy(original);
deepCopied.nested.age = 40;
console.log(original.nested.age); // 30 (unchanged)


// ============================================
// 11. FLATTEN DEEPLY NESTED OBJECT
// ============================================

// 11.1 Flatten object to single level with dot notation
function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

// 11.2 Flatten with custom separator
function flattenObjectCustom(obj, separator = '.', prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObjectCustom(obj[key], separator, newKey));
    } else {
      acc[newKey] = obj[key];
    }
    
    return acc;
  }, {});
}

// 11.3 Unflatten (reverse operation)
function unflattenObject(obj, separator = '.') {
  const result = {};
  
  for (const key in obj) {
    const keys = key.split(separator);
    keys.reduce((acc, currentKey, index) => {
      if (index === keys.length - 1) {
        acc[currentKey] = obj[key];
      } else {
        acc[currentKey] = acc[currentKey] || {};
      }
      return acc[currentKey];
    }, result);
  }
  
  return result;
}

// 11.4 Flatten array (deeply nested arrays)
function flattenArray(arr, depth = Infinity) {
  if (depth === 0) return arr.slice();
  
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flattenArray(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

// Native flat method polyfill
if (!Array.prototype.myFlat) {
  Array.prototype.myFlat = function(depth = 1) {
    const flatten = (arr, currentDepth) => {
      return arr.reduce((acc, val) => {
        if (Array.isArray(val) && currentDepth < depth) {
          acc.push(...flatten(val, currentDepth + 1));
        } else {
          acc.push(val);
        }
        return acc;
      }, []);
    };
    
    return flatten(this, 0);
  };
}

// Usage
const nested = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
      f: {
        g: 4
      }
    }
  }
};

console.log(flattenObject(nested));
// { 'a': 1, 'b.c': 2, 'b.d.e': 3, 'b.d.f.g': 4 }

const nestedArray = [1, [2, [3, [4, 5]]]];
console.log(flattenArray(nestedArray)); // [1, 2, 3, 4, 5]


// ============================================
// 12. MEMOIZATION / CACHING
// ============================================

// 12.1 Basic Memoization
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit');
      return cache.get(key);
    }
    
    console.log('Computing...');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 12.2 Memoization with custom key generator
function memoizeWithKey(fn, keyGenerator) {
  const cache = new Map();
  
  return function(...args) {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 12.3 LRU (Least Recently Used) Cache
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    // Delete if exists (to reinsert at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Remove least recently used if at capacity
    if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

// 12.4 Memoization with LRU
function memoizeWithLRU(fn, maxSize = 100) {
  const cache = new LRUCache(maxSize);
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.put(key, result);
    return result;
  };
}

// 12.5 Memoization with expiration
function memoizeWithExpiration(fn, ttl = 60000) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      if (now - timestamp < ttl) {
        return value;
      }
      cache.delete(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

// 12.6 Memoization for async functions
function memoizeAsync(fn) {
  const cache = new Map();
  const pending = new Map();
  
  return async function(...args) {
    const key = JSON.stringify(args);
    
    // Return cached result
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Return pending promise
    if (pending.has(key)) {
      return pending.get(key);
    }
    
    // Create new promise
    const promise = fn.apply(this, args);
    pending.set(key, promise);
    
    try {
      const result = await promise;
      cache.set(key, result);
      pending.delete(key);
      return result;
    } catch (error) {
      pending.delete(key);
      throw error;
    }
  };
}

// Usage
const expensiveFunction = (n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i;
  }
  return sum;
};

const memoized = memoize(expensiveFunction);
console.log(memoized(1000000)); // Computing...
console.log(memoized(1000000)); // Cache hit


// ============================================
// 13. PROMISE.FINALLY POLYFILL
// ============================================

if (!Promise.prototype.myFinally) {
  Promise.prototype.myFinally = function(onFinally) {
    return this.then(
      // On fulfillment
      (value) => {
        return Promise.resolve(onFinally()).then(() => value);
      },
      // On rejection
      (reason) => {
        return Promise.resolve(onFinally()).then(() => {
          throw reason;
        });
      }
    );
  };
}

// More complete implementation
if (!Promise.prototype.finallyPolyfill) {
  Promise.prototype.finallyPolyfill = function(onFinally) {
    const P = this.constructor;
    
    return this.then(
      (value) => P.resolve(onFinally()).then(() => value),
      (reason) => P.resolve(onFinally()).then(() => { throw reason; })
    );
  };
}

// Usage
Promise.resolve(42)
  .myFinally(() => {
    console.log('Cleanup');
  })
  .then(value => console.log(value)); // 42

Promise.reject('error')
  .myFinally(() => {
    console.log('Cleanup even on error');
  })
  .catch(err => console.log(err)); // 'error'


// ============================================
// 14. RETRY MECHANISM
// ============================================

// 14.1 Basic Retry
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
      }
      
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 14.2 Retry with exponential backoff
async function retryWithBackoff(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    onRetry = () => {}
  } = options;
  
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      onRetry(attempt, error, delay);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }
}

// 14.3 Retry with jitter (randomization to prevent thundering herd)
async function retryWithJitter(fn, options = {}) {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    onRetry = () => {}
  } = options;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      const jitter = Math.random() * exponentialDelay;
      const delay = exponentialDelay / 2 + jitter;
      
      onRetry(attempt, error, delay);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 14.4 Retry with condition (only retry on specific errors)
async function retryWithCondition(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    shouldRetry = () => true,
    onRetry = () => {}
  } = options;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const canRetry = attempt < maxAttempts && shouldRetry(error, attempt);
      
      if (!canRetry) {
        throw error;
      }
      
      onRetry(attempt, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 14.5 Advanced retry with timeout and abort
async function retryAdvanced(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    timeout = 0,
    shouldRetry = () => true,
    onRetry = () => {},
    signal
  } = options;
  
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Check if aborted
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }
    
    try {
      // Add timeout if specified
      if (timeout > 0) {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), timeout);
        });
        
        return await Promise.race([fn(), timeoutPromise]);
      }
      
      return await fn();
    } catch (error) {
      const canRetry = attempt < maxAttempts && shouldRetry(error, attempt);
      
      if (!canRetry) {
        throw error;
      }
      
      onRetry(attempt, error, delay);
      
      // Wait with ability to abort
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, delay);
        
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new Error('Operation aborted'));
          });
        }
      });
      
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }
}

// Usage examples
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

// Basic retry
retry(fetchData, 3, 2000)
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Failed:', err));

// Retry with exponential backoff
retryWithBackoff(fetchData, {
  maxAttempts: 5,
  initialDelay: 1000,
  backoffFactor: 2,
  onRetry: (attempt, error, delay) => {
    console.log(`Attempt ${attempt} failed: ${error.message}`);
    console.log(`Retrying in ${delay}ms...`);
  }
});

// Retry only on network errors
retryWithCondition(fetchData, {
  maxAttempts: 3,
  shouldRetry: (error) => {
    // Only retry on network errors, not 4xx errors
    return !error.message.includes('404') && !error.message.includes('400');
  }
});

// Advanced retry with abort
const controller = new AbortController();
retryAdvanced(fetchData, {
  maxAttempts: 5,
  timeout: 5000,
  signal: controller.signal,
  onRetry: (attempt, error, delay) => {
    console.log(`Retry attempt ${attempt} after ${delay}ms`);
  }
});

// Abort after 10 seconds
setTimeout(() => controller.abort(), 10000);


// ============================================
// INTERVIEW TIPS & BEST PRACTICES
// ============================================

/*
KEY POINTS FOR SENIOR INTERVIEWS (8+ Years):

1. ERROR HANDLING
   - Always validate inputs
   - Handle edge cases (null, undefined, empty arrays)
   - Provide meaningful error messages

2. PERFORMANCE CONSIDERATIONS
   - Use WeakMap for circular reference handling
   - Consider memory implications of caching
   - Use appropriate data structures (Map vs Object)

3. BROWSER COMPATIBILITY
   - Check for existing native implementations
   - Use feature detection, not browser detection
   - Gracefully handle missing features

4. CODE QUALITY
   - Write clean, readable code
   - Add comments for complex logic
   - Follow SOLID principles

5. TESTING CONSIDERATIONS
   - Think about edge cases
   - Consider how to test async code
   - Handle race conditions

6. COMMON INTERVIEW QUESTIONS
   - "Why would you use X over Y?"
   - "What are the performance implications?"
   - "How would you handle edge case Z?"
   - "What improvements would you make to this implementation?"

7. ADVANCED CONCEPTS TO MENTION
   - Closures and lexical scope
   - Event loop and microtask queue
   - Memory management and garbage collection
   - Promise chaining and error propagation
   - Prototype chain and inheritance

8. REAL-WORLD SCENARIOS
   - Rate limiting API calls
   - Handling network failures gracefully
   - Implementing undo/redo functionality
   - Building reactive systems
   - Optimizing rendering performance
*/[index] = await task();
        completed++;
      } catch (error) {
        results[index] = { error };
        completed++;
      }
    }
  }
  
  const workers = Array(Math.min(limit, tasks.length))
    .fill()
    .map(() => worker());
  
  await Promise.all(workers);
  return results;
}

// With progress tracking
async function parallelLimitWithProgress(tasks, limit, onProgress) {
  const results = new Array(tasks.length);
  const iterator = tasks.entries();
  let completed = 0;
  
  async function worker() {
    for (const [index, task] of iterator) {
      try {
        results