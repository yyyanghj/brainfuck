<template>
  <div id="app">
    <div class="container">
      <h2 class="title">Brainfuck!</h2>

      <textarea class="input" v-model="input"></textarea>

      <div class="wrapper">
        <div class="cell" :class="{ current: pointIndex === index }" v-for="(val,index) of cells" :key="index">{{val}}</div>
      </div>

      <div class="action">
        <button class="btn" @click="start">start</button>
        <!-- <button class="btn" @click="pause">pause</button> -->
        <input
          ref="asciiInp"
          class="ascii-inp"
          type="text"
          placeholder="输入一个ASCII字符"
          v-model="asciiChar"
          v-show="showAsciiInput"
        >
        <button class="btn" @click="confirm" v-show="showAsciiInput">确定</button>
      </div>

      <div class="output">{{ output }}</div>
    </div>
  </div>
</template>

<script>
// ++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>++.>+.+++++++..+++.<<++.>+++++++++++++++.>.+++.------.--------.<<+.<.
import ascii from './assets/ascii';
const { asciiMap, asciiArr } = ascii;

class Stack {
  constructor() {
    this.stack = [];
  }

  push(val) {
    return this.stack.push(val);
  }

  pop() {
    return this.stack.pop();
  }

  get size() {
    return this.stack.length;
  }

  get top() {
    return this.stack[this.size - 1];
  }
}

const COMMANDS = {
  '+': function() {
    this.$set(this.cells, this.pointIndex, this.currentVal + 1);
    return true;
  },
  '-': function() {
    if (this.currentVal > 0) {
      this.$set(this.cells, this.pointIndex, this.currentVal - 1);
    }
    return true;
  },
  '>': function() {
    this.pointIndex++;
    return true;
  },
  '<': function() {
    this.pointIndex > 0 && this.pointIndex--;
    return true;
  },
  '[': function() {
    this.loopStack.push(this.readIndex);
    if (this.currentVal === 0) {
      while (this.currentChar !== ']') {
        this.readIndex++;
      }
    }
    return true;
  },
  ']': function() {
    if (this.currentVal !== 0) {
      this.readIndex = this.loopStack.pop();
      return false;
    }
    return true;
  },
  ',': function() {
    alert('输入一个ascii字符');
    this.pause();
    this.showAsciiInput = true;
    this.$refs.asciiInp.focus();
    return true;
  },
  '.': function() {
    this.output += asciiArr[this.currentVal];
    return true;
  }
};

export default {
  name: 'app',
  components: {},
  data() {
    return {
      timer: null,
      input:
        '++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>++.>+.+++++++..+++.<<++.>+++++++++++++++.>.+++.------.--------.<<+.<',
      output: '',
      readIndex: 0,
      pointIndex: 0,
      asciiChar: '',
      showAsciiInput: false,
      cells: Array(30).fill(0),
      loopStack: new Stack()
    };
  },
  computed: {
    currentChar() {
      return this.input.replace(/\s/g, '').charAt(this.readIndex);
    },
    currentVal() {
      return this.cells[this.pointIndex];
    }
  },
  methods: {
    start() {
      if (!this.timer) {
        this.output = '';
        this.readIndex = 0;
        this.run();
      }
    },
    run() {
      this.timer = setInterval(() => {
        this.read();
      }, 17);
    },
    pause() {
      this.isPause = !this.isPause;
    },
    read() {
      if (this.isPause || !this.currentChar) {
        this.timer = null;
        return;
      }

      if (COMMANDS[this.currentChar]) {
        const next = COMMANDS[this.currentChar].call(this);
        next && this.readIndex++;
      } else {
        this.timer = null;
        alert('指令错误');
      }
    },
    confirm() {
      const char = this.asciiChar.charAt(0);
      this.cells[this.pointIndex] = asciiMap.get(char);
      this.isPause = false;
      this.showAsciiInput = false;
      this.run();
    }
  }
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
body {
  font-family: Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei';
}
.container {
  position: relative;
  width: 1000px;
  margin: 0 auto;
  .title {
    margin: 30px 0;
    text-align: center;
    font-size: 36px;
  }

  .input {
    display: block;
    width: 1000px;
    margin: 25px auto;
    padding: 25px;
    min-height: 300px;
    border: 1px solid #39bae6;
    border-radius: 5px;
    font-size: 18px;
    letter-spacing: 3px;
    font-family: Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei';
    background: #5b5b5b;
    color: #ffffff;
    line-height: 20px;
  }
  .output {
    margin: 25px auto 0;
    width: 1000px;
    padding: 25px;
    min-height: 150px;
    border: 1px solid #39bae6;
    border-radius: 5px;
    font-size: 18px;
    font-family: Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei';
    background: #5b5b5b;
    color: #ffffff;
    line-height: 20px;
  }
  .wrapper {
    margin: 25px auto 0;
    display: flex;
    flex-flow: row wrap;

    .cell {
      position: relative;
      margin-top: 30px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 20px;
      color: #39bae6;
      border: 1px solid #888;
      &.current {
        &:after {
          content: '';
          display: block;
          position: absolute;
          top: -30px;
          left: 50%;
          margin-left: -11px;
          width: 22px;
          height: 22px;
          background: url('./assets/arrow_down.png') no-repeat;
          background-size: 22px 22px;
        }
      }
    }
  }
  .btn {
    margin-top: 25px;
    margin-right: 25px;
    width: 60px;
    height: 36px;
    outline: none;
    border: none;
    color: #000;
    background-color: #f1f1f1;
  }
  .ascii-inp {
    width: 200px;
    height: 30px;
    border: 1px solid #000;
    border-radius: 5px;
    outline: none;
    padding-left: 18px;
    margin-right: 25px;
  }
}
</style>
