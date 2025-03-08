import { LogLevel } from "@framework/live2dcubismframework";

// 画布id
export let CanvasId = "live2d";
// 画布尺寸
export const CanvasSize: { width: number; height: number } | "auto" = "auto";

// 画布数量
export const CanvasNum = 1;

// 画面
export const ViewScale = 1.0;
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 模型相对路径
export const ResourcesPath = "/src/assets";

// 模型后面的背景图像文件
// export const BackImageName = '/img/baoan.png';
export const BackImageName = "";

// 模型定义----------------------------------
// 放置模型的目录名数组
// 使目录名与model3.json的名称一致
export const ModelDir: string[] = [
  "Mao",
  "haru",
  "kei_vowels_pro",
  "tororo",
  "Mark",
  "Rice",
  "miara_pro_t03",
//   "izumi_illust",
//   "fense",
];

export const ModelDirSize: number = ModelDir.length;

// 与外部定义文件（json）匹配
export const MotionGroupIdle = "Idle"; // 待机状态
export const MotionGroupTapBody = "TapBody"; // 点击身体时

// 与外部定义文件（json）匹配
export const HitAreaNameHead = "Head";
export const HitAreaNameBody = "Body";

// 运动优先级常数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// MOC3一致性验证选项
export const MOCConsistencyValidationEnable = true;

// 调试日志显示选项
export const DebugLogEnable = true; // debug日志
export const DebugTouchLogEnable = false; // 鼠标日志

// 从框架输出的日志级别设置
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

export interface IOpt {
  CanvasId: string; // 画布id
}

export function setDefineOption(opt: IOpt) {
  CanvasId = opt.CanvasId;
}
