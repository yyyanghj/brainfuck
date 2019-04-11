<template>
  <div id="app">
    <div class="container">
      <h2 class="title">Brainfuck!</h2>

      <textarea class="input" v-model="input"></textarea>

      <div class="wrapper">
        <div class="cell" :class="{ current: pointer === index }" v-for="(val,index) of cells" :key="index">{{val}}</div>
      </div>

      <div class="action">
        <button class="btn" @click="run">RUN</button>
        <button class="btn" @click="pause">PAUSE</button>
        <button class="btn" @click="reset">RESET</button>
      </div>

      <div class="output">{{ output }}</div>
    </div>

    <div class="modal" v-show="showModal">
      <div class="content">
        <input ref="asciiInp" type="text" placeholder="输入一个ASCII字符" v-model="asciiChar" maxlength="1">
        <button class="btn" @click="confirm">YES</button>
      </div>
    </div>
  </div>
</template>

<script>
import { asciiMap, asciiArr } from './assets/ascii';
import Stack from './assets/stack';

const initialInput = `
    这段代码会输出 Hello World!
    ++++++++++[>+>+++>+++++++>+
    +++++++++<<<<-]>>>++.>+.++
    +++++..+++.<<++.>++++++++++
    +++++.>.+++.------.--------.<
    <+.<
  `;

export default {
  name: 'app',
  components: {},
  data() {
    return {
      input: initialInput,
      output: '',
      currentIndex: 0,
      pointer: 0,
      asciiChar: '',
      showModal: false,
      cells: Array(30).fill(0),
      loopStack: new Stack()
    };
  },
  computed: {
    inputCommands() {
      const reg = /[^><+-\][.,]*/g;
      return this.input.replace(reg, '').replace(/[\d\w\s]*/g, '');
    },
    currentCommand() {
      return this.inputCommands.charAt(this.currentIndex);
    },
    currentVal() {
      return this.cells[this.pointer];
    }
  },
  methods: {
    reset() {
      this.input = '';
      this.output = '';
      this.currentIndex = 0;
      this.cells.fill(0);
      this.loopStack.clear();
    },

    pause() {
      this.isPause = true;
    },

    run() {
      const command = this.currentCommand;
      this.isPause = false;

      if (!command) {
        return;
      }

      if (this.validate(command)) {
        const next = this.execute(command);
        next && this.currentIndex++;
      }

      setTimeout(() => {
        !this.isPause && this.run();
      }, 17);
    },

    execute(command) {
      switch (command) {
        case '+':
          this.$set(this.cells, this.pointer, this.currentVal + 1);
          return true;

        case '-':
          if (this.currentVal > 0) {
            this.$set(this.cells, this.pointer, this.currentVal - 1);
          }
          return true;

        case '>':
          this.pointer++;
          return true;

        case '<':
          this.pointer > 0 && this.pointer--;
          return true;

        case '[':
          // stack 推入循环起始索引
          this.loopStack.push(this.currentIndex);
          // 若当前指针为零,则跳转到后一个]
          if (this.currentVal === 0) {
            while (this.currentCommand !== ']') {
              this.currentIndex++;
            }
          }
          return true;

        case ']':
          // 若当前指针不为零,则跳转到前一个[
          if (this.currentVal !== 0) {
            // 回到循环起始索引处
            this.currentIndex = this.loopStack.pop();
            return false;
          }
          return true;

        case ',':
          this.pause();
          this.showModal = true;
          return true;

        case '.':
          this.output += asciiArr[this.currentVal];
          return true;

        default:
          break;
      }
    },

    validate(char) {
      const chars = ['+', '-', '<', '>', '[', ']', ',', '.'];
      if (chars.includes(char)) {
        return true;
      }
      return false;
    },

    confirm() {
      this.cells[this.pointer] = asciiMap.get(this.asciiChar);
      this.showModal = false;
      this.asciiChar = '';
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

@bgColor: #f5f7f9;
@fgColor: #48505b;
@accentColor: #40b3ff;

body {
  font-family: Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei';
  background-color: #eee;
  color: @fgColor;
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

  .input,
  .output {
    display: block;
    width: 1000px;
    margin: 50px auto;
    padding: 25px;
    min-height: 200px;
    border: 1px solid @accentColor;
    border-radius: 5px;
    font-size: 18px;
    letter-spacing: 3px;

    background: @bgColor;
    color: @fgColor;
    line-height: 20px;
  }

  .wrapper {
    margin: 25px auto 0;
    display: flex;
    flex-flow: row wrap;
    border-top: 1px solid @fgColor;
    border-left: 1px solid @fgColor;

    .cell {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      font-size: 20px;
      color: @accentColor;
      background: @bgColor;
      border-bottom: 1px solid @fgColor;
      border-right: 1px solid @fgColor;

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
}
.btn {
  margin-top: 25px;
  margin-right: 25px;
  width: 88px;
  height: 36px;
  border-radius: 18px;
  outline: none;
  border: 1px solid @accentColor;
  color: @accentColor;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: @accentColor;
  }
}

.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  .content {
    position: absolute;
    width: 200px;
    height: 100px;
    padding: 24px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: @bgColor;
  }

  .btn {
    margin: 15px auto;
  }

  input {
    width: 200px;
    height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid @accentColor;
    background: @bgColor;
    text-indent: 16px;
  }
}
</style>
