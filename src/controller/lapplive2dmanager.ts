import { CubismMatrix44 } from "@framework/math/cubismmatrix44";
// import { ACubismMotion } from '@framework/motion/acubismmotion';
import { csmVector } from "@framework/type/csmvector";

import * as LAppDefine from "./lappdefine";
import { LAppModel } from "./lappmodel";
import { LAppPal } from "./lapppal";
import { LAppSubdelegate } from "./lappsubdelegate";

/**
 * 在示例应用程序中管理CubismModel的类
 * 进行模型生成和废弃、轻敲事件的处理、模型切换。
 */
export class LAppLive2DManager {
  private _subdelegate: LAppSubdelegate;

  private _viewMatrix: CubismMatrix44; // 用于模型绘制的视图矩阵
  private _models: csmVector<LAppModel>; // 模型实例容器
  private _sceneIndex: number; // 场景索引值

  public constructor() {
    this._subdelegate = null;
    this._viewMatrix = new CubismMatrix44();
    this._models = new csmVector<LAppModel>();
    this._sceneIndex = 0;
  }

  /**
   * 释放当前场景中保留的所有模型
   */
  private releaseAllModel() {
    this._models.clear();
  }

  /**
   *   拖动屏幕时的操作
   *
   *   @param x画面的X坐标
   *   @param y画面的Y坐标
   */
  public onDrag(x: number, y: number) {
    // const model: LAppModel = this._models.at(0);
    // if (model) {
    //   model.setDragging(x, y);
    // }
  }

  /**
   *点击画面时的处理
   *
   * @param x画面的X坐标
   * @param y画面的Y坐标
   */
  public onTap(x: number, y: number) {
    // if (LAppDefine.DebugLogEnable) {
    //   LAppPal.printMessage(
    //     `[APP]tap point: {x: ${x.toFixed(2)} y: ${y.toFixed(2)}}`
    //   );
    // }
    // const model: LAppModel = this._models.at(0);
    // if (model.hitTest(LAppDefine.HitAreaNameHead, x, y)) {
    //   if (LAppDefine.DebugLogEnable) {
    //     LAppPal.printMessage(`[APP]hit area: [${LAppDefine.HitAreaNameHead}]`);
    //   }
    //   model.setRandomExpression();
    // } else if (model.hitTest(LAppDefine.HitAreaNameBody, x, y)) {
    //   if (LAppDefine.DebugLogEnable) {
    //     LAppPal.printMessage(`[APP]hit area: [${LAppDefine.HitAreaNameBody}]`);
    //   }
    //   model.startRandomMotion(
    //     LAppDefine.MotionGroupTapBody,
    //     LAppDefine.PriorityNormal,
    //     this.finishedMotion,
    //     this.beganMotion
    //   );
    // }
  }

  /**
   * 更新屏幕时的处理
   * 进行模型的更新处理及描绘处理
   */
  public onUpdate() {
    const { width, height } = this._subdelegate.getCanvas();
    const projection: CubismMatrix44 = new CubismMatrix44();
    const model: LAppModel = this._models.at(0);
    if (model.getModel()) {
      if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
        // 在纵向窗口中显示横向较长的模型时，根据模型的横向尺寸计算scale
        model.getModelMatrix().setWidth(2.0);
        projection.scale(1.0, width / height);
      } else {
        projection.scale(height / width, 1.0);
      }
      if (this._viewMatrix != null) {
        projection.multiplyByMatrix(this._viewMatrix);
      }
    }
    model.update();
    model.draw(projection); // 因为是“引用传递”，所以 projection 会被改变
  }

  /**
   * 切换到下一个场景
   * 在示例应用程序中切换模型集。
   */
  public nextScene(): void {
    const no: number = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
    this.changeScene(no);
  }

  /**
   * 切换场景
   * 在示例应用程序中切换模型集。
   * @param index
   */
  private changeScene(index: number): void {
    this._sceneIndex = index;

    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(`[APP]model index: ${this._sceneIndex}`);
    }

    // 从ModelDir[]中保留的目录名称
    // 确定model3.json的路径。
    // 使目录名与model3.json的名称一致。
    const model: string = LAppDefine.ModelDir[index];
    const modelPath: string =
      LAppDefine.ResourcesPath + "/model/" + model + "/";
    let modelJsonName: string = LAppDefine.ModelDir[index];
    modelJsonName += ".model3.json";

    this.releaseAllModel();
    const instance = new LAppModel();
    instance.setSubdelegate(this._subdelegate);
    instance.loadAssets(modelPath, modelJsonName);
    this._models.pushBack(instance);
  }

  public setViewMatrix(m: CubismMatrix44) {
    for (let i = 0; i < 16; i++) {
      this._viewMatrix.getArray()[i] = m.getArray()[i];
    }
  }

  // /**
  //  * モデルの追加
  //  */
  // public addModel(sceneIndex: number = 0) {
  //   this._sceneIndex = sceneIndex;
  //   this.changeScene(this._sceneIndex);
  // }

  /**
   * 初始化
   * @param subdelegate
   */
  public initialize(subdelegate: LAppSubdelegate) {
    this._subdelegate = subdelegate;
    this.changeScene(this._sceneIndex);
  }

  // // モーション再生開始のコールバック関数
  // public beganMotion = (self: ACubismMotion) => {
  //   LAppPal.printMessage("Motion Began:");
  //   console.log(self);
  // };
  // // モーション再生終了のコールバック関数
  // public finishedMotion = (self: ACubismMotion) => {
  //   LAppPal.printMessage("Motion Finished:");
  //   console.log(self);
  // };

  public getMotion() {
    // return this._models.at(0);
  }
}
