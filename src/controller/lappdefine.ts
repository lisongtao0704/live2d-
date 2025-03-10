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
  "izumi_illust",
  "kei_vowels_pro",
  "tororo",
  "Mark",
  "Rice",
  "miara_pro_t03",
  "fense",
  //
  // "lafei",
  // "lafei_4",
  // "leigensibao_2",
  // "lingbo",
  // "linuo_3",
  // "maliluosi_3_doa",
  // "ougen_6",
  // "qiye_7",
  // "rangbaer_4",
  // "shengluyisi_2_hx",
  // "shengluyisi_5",
  // "shitelasai_2",
  // "sitelasibao_2",
  // "sitelasibao_2_hx",
  // "suweiaitongmeng_2",
  // "tiancheng_3",
  // "tianlangxing_3",
  // "tierbici_2",
  // "weineituo_2",
  // "weixi_2",
  // "xiafei_4",
  // "xuefeng",
  // "xinnong_3",
  // "xinnong_4",
  // "xinzexi_3",
  // "xixuegui_4",
  // "xukufu_2",
  // "xukufu_3",
  // "yanusi_3",
  // "zhaohe_3",
  // "pinghai_4",
  // "qiye_9",
  // "yibei_3",
  // "xianghe_2",
  // "chaijun_4_hx",
  // "adaerbote_3",
  // "edu_4",
  // "shengluyisi_4",
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

// 头部控制参数
export let IsOpenDragAngleParam = true;
export let LR = 0; // 左右摆头比例系数
export let TB = 0; // 上下摆头

// 眼球控制
export let IsOpenDragEyeBallParam = true;
export let LR_Eye = 0;
export let TB_Eye = 0;

// 眼部控制
export let IsOpenMouthParam = true;
export let Mouth = 0;

// MOC3一致性验证选项
export const MOCConsistencyValidationEnable = true;

// 调试日志显示选项
export const DebugLogEnable = true; // debug日志
export const DebugTouchLogEnable = false; // 鼠标日志

// 从框架输出的日志级别设置
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

export interface IOpt {
  CanvasId?: string; // 画布id
  IsOpenDragAngleParam?: boolean; // 是否允许拖动改变参数
  IsOpenDragEyeBallParam?: boolean; // 是否允许拖动改变参数
  LR?: number; // -30 - 30
  TB?: number;
  LR_Eye?: number;
  TB_Eye?: number;
  IsOpenMouthParam?: boolean;
  Mouth?: number; // 0-1
}

export function setDefineOption(opt: IOpt) {
  CanvasId = opt.CanvasId ?? CanvasId;
  IsOpenDragAngleParam = opt.IsOpenDragAngleParam ?? IsOpenDragAngleParam;
  LR = opt.LR ?? LR;
  TB = opt.TB ?? TB;
  IsOpenDragEyeBallParam = opt.IsOpenDragEyeBallParam ?? IsOpenDragEyeBallParam;
  LR_Eye = opt.LR_Eye ?? LR_Eye;
  TB_Eye = opt.TB_Eye ?? TB_Eye;
  IsOpenMouthParam = opt.IsOpenMouthParam ?? IsOpenMouthParam;
  Mouth = opt.Mouth ?? Mouth;
}
