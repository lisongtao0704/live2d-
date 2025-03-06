import { CubismMatrix44 } from "@framework/math/cubismmatrix44";
import { CubismViewMatrix } from "@framework/math/cubismviewmatrix";

import * as LAppDefine from "./lappdefine";
// import { LAppDelegate } from './lappdelegate';
// import { LAppPal } from './lapppal';
import { LAppSprite } from './lappsprite';
import { TextureInfo } from './lapptexturemanager';
// import { TouchManager } from './touchmanager';
import { LAppSubdelegate } from "./lappsubdelegate";

export class LAppView {
  // private _touchManager: TouchManager; // タッチマネージャー
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
    // this._touchManager = new TouchManager();
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
}
