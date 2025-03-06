import { csmVector } from "@framework/type/csmvector";
import { CubismFramework, Option } from "@framework/live2dcubismframework";
import * as LAppDefine from "./lappdefine";
import { LAppSubdelegate } from "./lappsubdelegate";
import { CubismLogError } from "@framework/utils/cubismdebug";

export let s_instance: LAppDelegate = null;

export class LAppDelegate {
  private _cubismOption: Option;
  private _canvases: csmVector<HTMLCanvasElement>;
  private _subdelegates: csmVector<LAppSubdelegate>;

  private constructor() {
    this._cubismOption = new Option();
    this._subdelegates = new csmVector<LAppSubdelegate>();
    this._canvases = new csmVector<HTMLCanvasElement>();
  }

  /**
   * 返回类的实例
   * 如果未生成实例，则在内部生成实例
   *
   * @return 类实例
   */
  public static getInstance(): LAppDelegate {
    if (s_instance == null) {
      s_instance = new LAppDelegate();
    }

    return s_instance;
  }

  /**
   * 释放一个类的实例
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance.release();
    }

    s_instance = null;
  }

  /**
   * 调整画布大小并重新初始化视图
   */
  public onResize(): void {
    // for (let i = 0; i < this._subdelegates.getSize(); i++) {
    //   this._subdelegates.at(i).onResize();
    // }
  }

  /**
   * 执行
   */
  public run(): void {
    const loop = (): void => {
      if (s_instance == null) {
        return;
      }
        for (let i = 0; i < this._subdelegates.getSize(); i++) {
          this._subdelegates.at(i).update();
        }
      requestAnimationFrame(loop);
    };
    loop();
  }

  private release(): void {
    this.releaseSubdelegates();
    CubismFramework.dispose();
    this._cubismOption = null;
  }

  private releaseSubdelegates() {}

  private initializeCubism() {
    // LAppPal.updateTime();
    // this._cubismOption.logFunction = LAppPal.printMessage;
    this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
    CubismFramework.startUp(this._cubismOption);
    CubismFramework.initialize();
  }

  private initializeSubdelegates() {
    let width: number = 100;
    let height: number = 100;
    this._canvases.prepareCapacity(LAppDefine.CanvasNum);
    this._subdelegates.prepareCapacity(LAppDefine.CanvasNum);

    const canvas = document.createElement("canvas");
    this._canvases.pushBack(canvas);
    canvas.style.width = `${width}vw`;
    canvas.style.height = `${height}vh`;
    document.getElementById('app').appendChild(canvas);

    const subdelegate = new LAppSubdelegate();
    subdelegate.initialize(this._canvases.at(0));
    this._subdelegates.pushBack(subdelegate);
    if (this._subdelegates.at(0).isContextLost()) {
      CubismLogError(
        `The context for Canvas at index ${0} was lost, possibly because the acquisition limit for WebGLRenderingContext was reached.`
      );
    }
  }

  public initialize(): boolean {
    this.initializeCubism();
    this.initializeSubdelegates();
    return true;
  }
}
