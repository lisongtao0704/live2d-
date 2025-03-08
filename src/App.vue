<script setup lang="ts">
import { reactive, ref } from "vue";
import * as LAppDefine from "./controller/lappdefine";

const modeName = ref(LAppDefine.ModelDir[0]);

// 模型
const model = ref();
// 人物
const character = ref();

const states = reactive({
  instance: {},
  btnList: [
    {
      id: "btn1",
      show: [],
      name: "表情控制",
      callback: () => {
        // console.log(model.value, character.value);
        character.value.setRandomExpression();
        // character.value.setExpression(getRandomElement(character.value._expressions._keyValues).first)
        // getRandomElement(character.value._expressions._keyValues).first;
      },
    },
  ],
} as any);

// function getRandomElement(arr) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

window.addEventListener("ok", (event: any) => {
  states.instance = event.detail;
  model.value = states.instance._subdelegates.at(0);
  character.value = model.value._live2dManager.getMotion();
  console.log(model.value);
});

function handleChange(value: string) {
  model.value._live2dManager.nextScene(value);
}
</script>

<template>
  <div id="container">
    <div class="control-panel">
      <a-form-item label="选择模型">
        <a-select
          placeholder="选择模型"
          v-model:value="modeName"
          @change="handleChange"
        >
          <a-select-option :value="name" v-for="name in LAppDefine.ModelDir">{{
            name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <template v-for="item in states.btnList" :key="item.id">
        <a-button
          type="primary"
          v-if="states.instance"
          @click.stop="item.callback()"
          >{{ item.name }}</a-button
        >
      </template>
    </div>
    <div class="canvas-frame">
      <canvas id="live2d"></canvas>
    </div>
  </div>
</template>

<style lang="less" scoped>
#container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  color: #000;
}
.control-panel {
  width: 350px;
  padding: 20px;
  .btn-item {
    padding: 0 10px;
    margin: 10px;
  }
}
.canvas-frame {
  width: calc(100vw - 350px);
  #live2d {
    width: 100%;
    height: 100%;
  }
}
</style>
