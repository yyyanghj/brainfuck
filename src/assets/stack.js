export default class Stack {
  constructor() {
    this.stack = [];
  }

  push(val) {
    return this.stack.push(val);
  }

  pop() {
    return this.stack.pop();
  }

  clear() {
    this.stack = [];
  }

  get size() {
    return this.stack.length;
  }

  get top() {
    return this.stack[this.size - 1];
  }
}
