// 部件

import { csmVector, iterator } from "@framework/type/csmvector";
import { LAppGlManager } from "./lappglmanager";

export class LAppTextureManager {
  private _textures: csmVector<TextureInfo>;
  private _glManager: LAppGlManager;

  public constructor() {
    this._textures = new csmVector<TextureInfo>();
  }

  public setGlManager(glManager: LAppGlManager): void {
    this._glManager = glManager;
  }
}

export class TextureInfo {
  img: HTMLImageElement; // 画像
  id: WebGLTexture = null; // テクスチャ
  width = 0; // 横幅
  height = 0; // 高さ
  usePremultply: boolean; // Premult処理を有効にするか
  fileName: string; // ファイル名
}
