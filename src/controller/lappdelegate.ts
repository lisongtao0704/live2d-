import { csmVector } from "@framework/type/csmvector";
import { CubismFramework, Option } from "@framework/live2dcubismframework";
import * as LAppDefine from "./lappdefine";
import { LAppSubdelegate } from "./lappsubdelegate";
import { CubismLogError } from "@framework/utils/cubismdebug";
import { LAppPal } from "./lapppal";

export let s_instance: LAppDelegate = null;

export class LAppDelegate {
  private _cubismOption: Option;
  private _canvases: csmVector<HTMLCanvasElement>;
  private _subdelegates: csmVector<LAppSubdelegate>;
  private pointBeganEventListener: (this: Document, ev: PointerEvent) => void;
  private pointMovedEventListener: (this: Document, ev: PointerEvent) => void;
  private pointEndedEventListener: (this: Document, ev: PointerEvent) => void;
  private pointCancelEventListener: (this: Document, ev: PointerEvent) => void;

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
    for (let i = 0; i < this._subdelegates.getSize(); i++) {
      this._subdelegates.at(i).onResize();
    }
  }

  /**
   * 执行
   */
  public run(): void {
    const loop = (): void => {
      if (s_instance == null) {
        return;
      }

      LAppPal.updateTime();
      for (let i = 0; i < this._subdelegates.getSize(); i++) {
        this._subdelegates.at(i).update();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  private release(): void {
    this.releaseEventListener();
    this.releaseSubdelegates();
    CubismFramework.dispose();
    this._cubismOption = null;
  }

  private releaseSubdelegates() {}

  private initializeCubism() {
    LAppPal.updateTime();
    this._cubismOption.logFunction = LAppPal.printMessage;
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
    document.getElementById("app").appendChild(canvas);

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
    this.initializeEventListener();
    return true;
  }

  /**
   * 指针激活时被调用。
   */
  private onPointerBegan(e: PointerEvent): void {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onPointBegan(e.pageX, e.pageY);
    }
  }

  /**
   * 指针移动
   */
  private onPointerMoved(e: PointerEvent): void {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onPointMoved(e.pageX, e.pageY);
    }
  }

  /**
   * 指针不活动时
   */
  private onPointerEnded(e: PointerEvent): void {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onPointEnded(e.pageX, e.pageY);
    }
  }

  /**
   * 指针被取消
   */
  private onPointerCancel(e: PointerEvent) {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onTouchCancel(e.pageX, e.pageY);
    }
  }

  /**
   * 解除事件侦听器。
   */
  private releaseEventListener() {
    document.removeEventListener("pointerup", this.pointBeganEventListener);
    this.pointBeganEventListener = null;
    document.removeEventListener("pointermove", this.pointMovedEventListener);
    this.pointMovedEventListener = null;
    document.removeEventListener("pointerdown", this.pointEndedEventListener);
    this.pointEndedEventListener = null;
    document.removeEventListener("pointerdown", this.pointCancelEventListener);
    this.pointCancelEventListener = null;
  }

  /**
   * 设置事件侦听器
   */
  private initializeEventListener() {
    this.pointBeganEventListener = this.onPointerBegan.bind(this);
    this.pointMovedEventListener = this.onPointerMoved.bind(this);
    this.pointEndedEventListener = this.onPointerEnded.bind(this);
    this.pointCancelEventListener = this.onPointerCancel.bind(this);

    // 指针相关回调函数注册
    document.addEventListener("pointerdown", this.pointBeganEventListener, {
      passive: true,
    });
    document.addEventListener("pointermove", this.pointMovedEventListener, {
      passive: true,
    });
    document.addEventListener("pointerup", this.pointEndedEventListener, {
      passive: true,
    });
    document.addEventListener("pointercancel", this.pointCancelEventListener, {
      passive: true,
    });
  }
}
