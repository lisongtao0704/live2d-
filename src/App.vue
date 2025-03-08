<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import * as LAppDefine from "./controller/lappdefine";

const modeName = ref(LAppDefine.ModelDir[0]);
const expression = ref(LAppDefine.ModelDir[0]);

const states = reactive({
  subdelegate: {}, // 模型控制器
  model: {}, // 模型实例
  btnList: [
    {
      id: "btn1",
      show: [],
      name: "表情控制",
      callback: () => {
        // console.log(model.value, character.value);
        states.model.setRandomExpression();
        // character.value.setExpression(getRandomElement(character.value._expressions._keyValues).first)
        // getRandomElement(character.value._expressions._keyValues).first;
      },
    },
  ],
} as any);

// function getRandomElement(arr) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }
function changeExpression(event) {
  states.model.setExpression(event.target.value);
  // console.log(88, states.model, states.model.setExpression, event.target.value);
}

window.addEventListener("ok", (event: any) => {
  states.subdelegate = event.detail._subdelegates.at(0);
  states.model = states.subdelegate._live2dManager.getMotion();
  console.log("模型准备好:", states.model);
});

window.addEventListener("modelSwitched", (event: any) => {
  states.subdelegate = event.detail._subdelegate;
  states.model = event.detail;
  console.log("切换模型:", event.detail, states.model?._expressions); // 获取事件附带的数据
});

function handleChange(value: string) {
  states.subdelegate._live2dManager.nextScene(value);
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
      <a-form-item
        label="表情控制"
        v-if="states.model?._expressions?._size !== 0"
      >
        <template
          v-for="item in states.model?._expressions?._keyValues"
          :key="item"
        >
          <a-radio-group size="small" @change="changeExpression">
            <a-radio-button v-if="item?.first" :value="item.first">{{
              item?.first
            }}</a-radio-button>
          </a-radio-group>
        </template>
      </a-form-item>
<!-- 
      <template v-for="item in states.btnList" :key="item.id">
        <a-button type="primary" @click.stop="item.callback()">{{
          item.name
        }}</a-button>
      </template> -->
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
  overflow: auto;
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
