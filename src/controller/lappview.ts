import { CubismMatrix44 } from "@framework/math/cubismmatrix44";
import { CubismViewMatrix } from "@framework/math/cubismviewmatrix";

import * as LAppDefine from "./lappdefine";
import { LAppPal } from "./lapppal";
import { LAppSprite } from "./lappsprite";
import { TextureInfo } from "./lapptexturemanager";
import { TouchManager } from "./touchmanager";
import { LAppSubdelegate } from "./lappsubdelegate";

export class LAppView {
  private _touchManager: TouchManager; // 触摸管理器
  private _deviceToScreen: CubismMatrix44;
  private _viewMatrix: CubismViewMatrix;
  private _programId: WebGLProgram; // 着色器标识id
  private _back: LAppSprite; // 背景画像
  // private _gear: LAppSprite; // ギア画像
  // private _changeModel: boolean; // モデル切り替えフラグ
  // private _isClick: boolean; // クリック中
  private _subdelegate: LAppSubdelegate;

  public constructor() {
    this._programId = null;
    this._back = null;
    // this._gear = null;
    this._touchManager = new TouchManager();
    this._deviceToScreen = new CubismMatrix44();
    this._viewMatrix = new CubismViewMatrix();
  }

  public initialize(subdelegate: LAppSubdelegate): void {
    this._subdelegate = subdelegate;
    const { width, height } = subdelegate.getCanvas();
    const ratio: number = width / height;
    const left: number = -ratio;
    const right: number = ratio;
    const bottom: number = LAppDefine.ViewLogicalLeft;
    const top: number = LAppDefine.ViewLogicalRight;

    this._viewMatrix.setScreenRect(left, right, bottom, top);
    this._viewMatrix.scale(LAppDefine.ViewScale, LAppDefine.ViewScale);

    this._deviceToScreen.loadIdentity();
    if (width > height) {
      const screenW: number = Math.abs(right - left);
      this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
    } else {
      const screenH: number = Math.abs(top - bottom);
      this._deviceToScreen.scaleRelative(screenH / height, -screenH / height);
    }
    this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);

    this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale); // 最大扩张率
    this._viewMatrix.setMinScale(LAppDefine.ViewMinScale); // 最小縮小率

    this._viewMatrix.setMaxScreenRect(
      LAppDefine.ViewLogicalMaxLeft,
      LAppDefine.ViewLogicalMaxRight,
      LAppDefine.ViewLogicalMaxBottom,
      LAppDefine.ViewLogicalMaxTop
    );
  }

  /**
   *  释放
   */
  public release(): void {
    this._viewMatrix = null;
    this._touchManager = null;
    this._deviceToScreen = null;

    this._back.release();
    this._back = null;

    this._subdelegate.getGlManager().getGl().deleteProgram(this._programId);
    this._programId = null;
  }

  public initializeSprite(): void {
    const width: number = this._subdelegate.getCanvas().width;
    const height: number = this._subdelegate.getCanvas().height;
    const textureManager = this._subdelegate.getTextureManager();
    const resourcesPath = LAppDefine.ResourcesPath;

    let imageName = "";

    // 背景图像初始化
    imageName = LAppDefine.BackImageName;

    const initBackGroundTexture = (textureInfo: TextureInfo): void => {
      const x: number = width * 0.5;
      const y: number = height * 0.5;
      const fwidth = textureInfo.width * 2.0;
      const fheight = height * 0.95;
      this._back = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
      this._back.setSubdelegate(this._subdelegate);
    };

    textureManager.createTextureFromPngFile(
      resourcesPath + imageName,
      false,
      initBackGroundTexture
    );

    // // 歯車画像初期化
    // imageName = LAppDefine.GearImageName;
    // const initGearTexture = (textureInfo: TextureInfo): void => {
    //   const x = width - textureInfo.width * 0.5;
    //   const y = height - textureInfo.height * 0.5;
    //   const fwidth = textureInfo.width;
    //   const fheight = textureInfo.height;
    //   this._gear = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
    //   this._gear.setSubdelegate(this._subdelegate);
    // };

    // textureManager.createTextureFromPngFile(
    //   resourcesPath + imageName,
    //   false,
    //   initGearTexture
    // );

    // 创建着色器
    if (this._programId == null) {
      this._programId = this._subdelegate.createShader();
    }
  }

  /**
   * 绘制
   */
  public render(): void {
    this._subdelegate.getGlManager().getGl().useProgram(this._programId);

    // 绘制背景
    if (this._back) {
      this._back.render(this._programId);
    }

    // if (this._gear) {
    //   this._gear.render(this._programId);
    // }

    this._subdelegate.getGlManager().getGl().flush();

    const lapplive2dmanager = this._subdelegate.getLive2DManager();
    if (lapplive2dmanager != null) {
      lapplive2dmanager.setViewMatrix(this._viewMatrix);

      lapplive2dmanager.onUpdate();
    }
  }

  /**
   * 将X坐标转换为View坐标。
   *
   * @param deviceX设备X坐标
   */
  public transformViewX(deviceX: number): number {
    const screenX: number = this._deviceToScreen.transformX(deviceX); // 获取逻辑坐标转换后的坐标。
    return this._viewMatrix.invertTransformX(screenX); // 放大、缩小和移动后的值。
  }

  /**
   * 将Y坐标转换为View坐标。
   *
   * @param deviceY 设备Y坐标
   */
  public transformViewY(deviceY: number): number {
    const screenY: number = this._deviceToScreen.transformY(deviceY); // 获取逻辑坐标转换后的坐标
    return this._viewMatrix.invertTransformY(screenY);
  }

  /**
   * 点击触摸时
   *
   * @param pointX 屏幕X坐标
   * @param pointY 屏幕Y坐标
   */
  public onTouchesBegan(pointX: number, pointY: number): void {
    this._touchManager.touchesBegan(
      pointX * window.devicePixelRatio,
      pointY * window.devicePixelRatio
    );
  }

  /**
   * 触摸时指针移动时被称为。
   *
   * @param pointX 屏幕X坐标
   * @param pointY 屏幕Y坐标
   */
  public onTouchesMoved(pointX: number, pointY: number): void {
    const posX = pointX * window.devicePixelRatio;
    const posY = pointY * window.devicePixelRatio;

    const lapplive2dmanager = this._subdelegate.getLive2DManager();

    const viewX: number = this.transformViewX(this._touchManager.getX());
    const viewY: number = this.transformViewY(this._touchManager.getY());

    this._touchManager.touchesMoved(posX, posY);

    lapplive2dmanager.onDrag(viewX, viewY);
  }

  /**
   *  触摸结束后。
   *
   * @param pointX  屏幕X坐标
   * @param pointY  屏幕Y坐标
   */
  public onTouchesEnded(pointX: number, pointY: number): void {
    const posX = pointX * window.devicePixelRatio;
    const posY = pointY * window.devicePixelRatio;

    const lapplive2dmanager = this._subdelegate.getLive2DManager();

    // 触摸结束
    lapplive2dmanager.onDrag(0.0, 0.0);

    const x: number = this.transformViewX(posX);
    const y: number = this.transformViewY(posY);

    if (LAppDefine.DebugTouchLogEnable) {
      LAppPal.printMessage(`[APP]touchesEnded x: ${x} y: ${y}`);
    }
    lapplive2dmanager.onTap(x, y);
    // // 歯車にタップしたか
    // if (this._gear.isHit(posX, posY)) {
    //   lapplive2dmanager.nextScene();
    // }
  }
}
