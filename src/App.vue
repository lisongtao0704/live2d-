<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import * as LAppDefine from "./controller/lappdefine";

const modeName = ref(LAppDefine.ModelDir[0]);

let subdelegate: any = {}; // 模型控制器
let model: any = {}; // 模型实例
const states = reactive({
  expressionsList: [], // 表情列表
  motionList: [], // 动作列表
  btnList: [
    {
      id: "btn1",
      show: [],
      name: "表情控制",
      callback: () => {
        // console.log(model.value, character.value);
        model.setRandomExpression();
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
  model.setExpression(event.target.value);
}

function changeMotion(event) {
  const motion = toRaw(states.motionList.getValue(event.target.value));
  model._motionManager.startMotionPriority(motion, false, 2);
}

window.addEventListener("modelSwitched", (event: any) => {
  subdelegate = event.detail._subdelegate;
  model = event.detail;
  states.expressionsList = model?._expressions;
  states.motionList = model?._motions;
  console.log("模型ok:", event.detail); // 获取事件附带的数据
});

function handleChange(value: string) {
  subdelegate._live2dManager.nextScene(value);
}

function throttleClick(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

const throttledClick = throttleClick(texture, 300);

let tag = true;

function texture() {
  if (tag) {
    subdelegate._textureManager.releaseTextureByFilePath(
      "/src/assets/model/haru/haru.1024/texture_02.png"
    );
    subdelegate._textureManager.createTextureFromPngFile(
      "/src/assets/model/haru/haru.1024/texture_03.png",
      true,
      (newTextureInfo) => {
        model.getRenderer().bindTexture(2, newTextureInfo.id);
      }
    );
  } else {
    subdelegate._textureManager.releaseTextureByFilePath(
      "/src/assets/model/haru/haru.1024/texture_03.png"
    );
    subdelegate._textureManager.createTextureFromPngFile(
      "/src/assets/model/haru/haru.1024/texture_02.png",
      true,
      (newTextureInfo) => {
        model.getRenderer().bindTexture(2, newTextureInfo.id);
      }
    );
  }
  tag = !tag;
}
</script>

<template>
  <div id="container">
    <div class="control-panel" @click.stop>
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
      <a-button
        type="primary"
        class="btn"
        v-if="modeName === 'haru'"
        @click="throttledClick"
        >更换纹理</a-button
      >
      <a-form-item label="表情控制" v-if="states.expressionsList?._size !== 0">
        <template
          v-for="item in states.expressionsList?._keyValues"
          :key="item"
        >
          <a-radio-group size="small" @change="changeExpression">
            <a-radio-button v-if="item?.first" :value="item.first">{{
              item?.first
            }}</a-radio-button>
          </a-radio-group>
        </template>
      </a-form-item>
      <a-form-item label="动作控制" v-if="states.motionList?._size !== 0">
        <template v-for="item in states.motionList?._keyValues" :key="item">
          <a-radio-group size="small" @change="changeMotion">
            <a-radio-button v-if="item?.first" :value="item.first">{{
              item?.first
            }}</a-radio-button>
          </a-radio-group>
        </template>
      </a-form-item>
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

.btn {
  margin-bottom: 24px;
  width: 100%;
}
</style>
