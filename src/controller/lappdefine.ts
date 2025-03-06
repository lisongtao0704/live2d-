import { LogLevel } from "@framework/live2dcubismframework";

// 画布尺寸
export const CanvasSize: { width: number; height: number } | "auto" = "auto";

// 画布数量
export const CanvasNum = 1;

// 画面
// export const ViewScale = 1.0;
// export const ViewMaxScale = 2.0;
// export const ViewMinScale = 0.8;

// export const ViewLogicalLeft = -1.0;
// export const ViewLogicalRight = 1.0;
// export const ViewLogicalBottom = -1.0;
// export const ViewLogicalTop = 1.0;

// export const ViewLogicalMaxLeft = -2.0;
// export const ViewLogicalMaxRight = 2.0;
// export const ViewLogicalMaxBottom = -2.0;
// export const ViewLogicalMaxTop = 2.0;

// 模型相对路径
export const ResourcesPath = "../live2d/Model";

// // 模型后面的背景图像文件
// // export let BackImageName = 'back_class_normal.png';
// export const BackImageName = '';

// // 歯車
// export const GearImageName = 'icon_gear.png';

// // 終了ボタン
// export const PowerImageName = 'CloseNormal.png';

// 模型定义----------------------------------
// 放置模型的目录名数组
// 使目录名与model3.json的名称一致
export const ModelDir: string[] = ["Mao", "haru", "kei_vowels_pro"];

export const ModelDirSize: number = ModelDir.length;

// 外部定義ファイル（json）と合わせる
// export const MotionGroupIdle = 'Idle'; // アイドリング
// export const MotionGroupTapBody = 'TapBody'; // 点击身体时

// // 外部定義ファイル（json）と合わせる
// export const HitAreaNameHead = 'Head';
// export const HitAreaNameBody = 'Body';

// 运动优先级常数
// export const PriorityNone = 0;
// export const PriorityIdle = 1;
// export const PriorityNormal = 2;
// export const PriorityForce = 3;

// MOC3一致性验证选项
// export const MOCConsistencyValidationEnable = true;

// 调试日志显示选项
// export const DebugLogEnable = true;
// export const DebugTouchLogEnable = false;

// 从框架输出的日志级别设置
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// 默认渲染目标大小
export const RenderTargetWidth = 1900;
export const RenderTargetHeight = 1000;
