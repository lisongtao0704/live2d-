<script setup lang="ts">
import { reactive, ref, toRaw, computed } from "vue";
import * as LAppDefine from "./controller/lappdefine";

const modeName = ref(LAppDefine.ModelDir[0]);
const checked = ref(false);
const lr = ref(50);
const tb = ref(50);
const checkedEye = ref(false);
const lr_eye = ref(50);
const tb_eye = ref(50);
const checkedMouth = ref(false);
const mouth = ref(0);
const textValue = ref("");
const cookieValue = ref("");
const loading = ref(false);

const isShowHead = computed(() => {
  const list = ["Mao", "kei_vowels_pro", "Rice", "miara_pro_t03"];
  return list.includes(modeName.value);
});

const isShowEye = computed(() => {
  const list = ["haru", "tororo", "izumi_illust"];
  return !list.includes(modeName.value);
});

const isShowMouth = computed(() => {
  const list = ["kei_vowels_pro", "Mark", "Rice", "miara_pro_t03"];
  return !list.includes(modeName.value);
});

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
  textValue.value = "";
  console.log("模型ok:", event.detail); // 获取事件附带的数据
});

function handleChange(value: string) {
  console.log("模型名称:", value);
  subdelegate._live2dManager.nextScene(value);
}

function throttleClick(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      // @ts-ignore
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
function changeChecked(value) {
  LAppDefine.setDefineOption({
    IsOpenDragAngleParam: !value,
  });
}

function changeCheckedEye(value) {
  LAppDefine.setDefineOption({
    IsOpenDragEyeBallParam: !value,
  });
}

function changeCheckedMouth(value) {
  LAppDefine.setDefineOption({
    IsOpenMouthParam: !value,
  });
}

function formatter(value: number) {
  let deg = 0;
  if (value === 50) {
    LAppDefine.setDefineOption({
      LR: 0,
    });
    return "正脸";
  } else if (value < 50) {
    deg = 30 - (value / 50) * 30;
    LAppDefine.setDefineOption({
      LR: -deg / 30,
    });
    return `左转头${Math.floor(deg)}度`;
  } else {
    deg = ((value - 50) / 50) * 30;
    LAppDefine.setDefineOption({
      LR: deg / 30,
    });
    return `右转头${Math.ceil(deg)}度`;
  }
}

function formattertb(value: number) {
  let deg = 0;
  if (value === 50) {
    LAppDefine.setDefineOption({
      TB: 0,
    });
    return "正脸";
  } else if (value < 50) {
    deg = 30 - (value / 50) * 30;
    LAppDefine.setDefineOption({
      TB: -deg / 30,
    });
    return `低头${Math.floor(deg)}度`;
  } else {
    deg = ((value - 50) / 50) * 30;
    LAppDefine.setDefineOption({
      TB: deg / 30,
    });
    return `抬头${Math.ceil(deg)}度`;
  }
}

function changeEyeX(value) {
  let ratio = 0;
  if (value === 50) {
    ratio = 0;
  } else if (value < 50) {
    ratio = (30 - (value / 50) * 30) / 30;
    LAppDefine.setDefineOption({
      LR_Eye: -ratio,
    });
  } else {
    ratio = (value - 50) / 50;
    LAppDefine.setDefineOption({
      LR_Eye: ratio,
    });
  }
}

function changeEyeY(value) {
  let ratio = 0;
  if (value === 50) {
    ratio = 0;
  } else if (value < 50) {
    ratio = (30 - (value / 50) * 30) / 30;
    LAppDefine.setDefineOption({
      TB_Eye: -ratio,
    });
  } else {
    ratio = (value - 50) / 50;
    LAppDefine.setDefineOption({
      TB_Eye: ratio,
    });
  }
}

function changeEyeMouth(value) {
  let ratio = value / 100;
  LAppDefine.setDefineOption({
    Mouth: ratio,
  });
}

function groupsMotios(name, index) {
  model.startMotion(name, index, 2);
}

async function send() {
  // if (!cookieValue.value) {
  //   alert("cookie不能为空");
  //   return;
  // }
  if (!textValue.value) {
    alert("文本内容不能为空");
    return;
  }
  // console.log("发送",  `EGG_SESS=${cookieValue.value}`);

  console.log("发送");
  document.cookie = `EGG_SESS=mpBO4aXGGGEYzVmB3smJoRnyAITg4XXx-OKlxDaDMGkDEPnaEtbSO5icjyKAQQEB;`
  loading.value = true;
  const result = await fetch("/api/user/audioAI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Cookie: `EGG_SESS=${cookieValue.value};`,
    },
    body: JSON.stringify({
      type: 1,
      text: textValue.value,
      verboseText: textValue.value,
      speaker: "moxiaozhao_meet_24k",
      speakerId: 136,
      speed: 5.5,
      pitch: 1,
      style: "general",
      provider: 6,
      pause_points: [],
      sceneType: 0,
      gender: 1,
      version: "6.0.0",
      isNotModified: false,
      isBroadcast: 1,
    }),
  });
  loading.value = false;
  const data = await result?.json();
  if (data.code === 200) {
    const url = `https://resources.laihua.com/${data.data.filename}`;
    model.playVoice(url);
  } else {
    alert("未登录");
  }
  console.log("结果", data.data.filename);
}

// <div class="token-frame">
//           <span>cookie(EGG_SESS):</span>
//           <a-input
//             v-model:value="cookieValue"
//             @pressEnter="changeCookie"
//             placeholder="请输入测试环境cookie, enter确认"
//           />
//         </div>

function changeCookie(value) {
  console.log(cookieValue.value);
  // document.cookie = `EGG_SESS=${cookieValue.value}`
  alert(`cookie设置成功:EGG_SESS=${cookieValue.value}`);
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
      <a-form-item label="组合控制" v-if="modeName === 'haru'">
        <a-radio-group size="small" @change="changeExpression">
          <a-radio-button value="0" @click="groupsMotios('FlickLeft', 1)"
            >FlickLeft1</a-radio-button
          >
          <a-radio-button value="1" @click="groupsMotios('FlickLeft', 2)"
            >FlickLeft2</a-radio-button
          >
          <a-radio-button value="2" @click="groupsMotios('Shake', 0)"
            >Shake0</a-radio-button
          >
          <a-radio-button value="3" @click="groupsMotios('Shake', 1)"
            >Shake1</a-radio-button
          >
        </a-radio-group>
      </a-form-item>
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
      <div class="head-frame" v-if="isShowHead">
        头部控制 <a-switch v-model:checked="checked" @change="changeChecked" />
      </div>
      <template v-if="checked && isShowHead">
        <a-form-item label="左右">
          <a-slider
            v-model:value="lr"
            :max="100"
            :min="0"
            style="width: 100%"
            :tip-formatter="formatter"
          />
        </a-form-item>
        <a-form-item label="上下">
          <a-slider
            v-model:value="tb"
            :max="100"
            :min="0"
            style="width: 100%"
            :tip-formatter="formattertb"
          />
        </a-form-item>
      </template>
      <div class="head-frame" v-if="isShowEye">
        眼球控制
        <a-switch v-model:checked="checkedEye" @change="changeCheckedEye" />
      </div>
      <template v-if="checkedEye && isShowEye">
        <a-form-item label="左右">
          <a-slider
            v-model:value="lr_eye"
            :max="100"
            :min="0"
            style="width: 100%"
            @change="changeEyeX"
          />
        </a-form-item>
        <a-form-item label="上下">
          <a-slider
            v-model:value="tb_eye"
            :max="100"
            :min="0"
            style="width: 100%"
            @change="changeEyeY"
          />
        </a-form-item>
      </template>

      <div class="head-frame" v-if="isShowMouth">
        嘴唇控制
        <a-switch v-model:checked="checkedMouth" @change="changeCheckedMouth" />
      </div>
      <template v-if="checkedMouth && isShowMouth">
        <a-form-item label="开合">
          <a-slider
            v-model:value="mouth"
            :max="100"
            :min="0"
            style="width: 100%"
            @change="changeEyeMouth"
          />
        </a-form-item>
      </template>
      <div v-if="isShowMouth">
        <div class="head-frame">语音合成</div>

        <a-textarea
          v-model:value="textValue"
          :auto-size="{ minRows: 5, maxRows: 5 }"
          showCount
          :maxlength="100"
        />
        <a-button
          style="margin-top: 10px"
          type="primary"
          class="btn"
          :loading="loading"
          @click="send"
          >合成</a-button
        >
      </div>
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
:deep(.ant-form-item) {
  .ant-slider-handle {
    top: 4px;
  }
  .ant-slider-track {
    background-color: transparent;
  }
  label {
    font-weight: 500;
    font-size: 15px;
  }
}
.head-frame {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 24px;
}
.token-frame {
  margin-bottom: 10px;
}
</style>

<style>
.ant-tooltip-arrow-content {
  display: none;
}
</style>
