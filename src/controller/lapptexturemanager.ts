// 部件

import { csmVector, iterator } from "@framework/type/csmvector";
import { LAppGlManager } from "./lappglmanager";

export class TextureInfo {
  img: HTMLImageElement; // 画像
  id: WebGLTexture = null; // 纹理id
  width = 0; // 横
  height = 0; // 高
  usePremultply: boolean; // 是否启用预处理
  fileName: string; // 文件名
}

export class LAppTextureManager {
  private _textures: csmVector<TextureInfo>;
  private _glManager: LAppGlManager;

  public constructor() {
    this._textures = new csmVector<TextureInfo>();
  }

  public setGlManager(glManager: LAppGlManager): void {
    this._glManager = glManager;
  }

  public createTextureFromPngFile(
    fileName: string,
    usePremultiply: boolean,
    callback: (textureInfo: TextureInfo) => void
  ) {
    for (
      let ite: iterator<TextureInfo> = this._textures.begin();
      ite.notEqual(this._textures.end());
      ite.preIncrement()
    ) {
      if (
        ite.ptr().fileName == fileName &&
        ite.ptr().usePremultply == usePremultiply
      ) {
        ite.ptr().img = new Image();
        ite
          .ptr()
          .img.addEventListener("load", (): void => callback(ite.ptr()), {
            passive: true,
          });
        ite.ptr().img.src = fileName;
        return;
      }
    }
    // 触发数据加载
    const img = new Image();
    img.addEventListener(
      "load",
      () => {
        // 创建纹理对象
        const tex: WebGLTexture = this._glManager.getGl().createTexture();
        // 选择纹理
        this._glManager
          .getGl()
          .bindTexture(this._glManager.getGl().TEXTURE_2D, tex);
        // 将像素写入纹理
        this._glManager
          .getGl()
          .texParameteri(
            this._glManager.getGl().TEXTURE_2D,
            this._glManager.getGl().TEXTURE_MIN_FILTER,
            this._glManager.getGl().LINEAR_MIPMAP_LINEAR
          );
        this._glManager
          .getGl()
          .texParameteri(
            this._glManager.getGl().TEXTURE_2D,
            this._glManager.getGl().TEXTURE_MAG_FILTER,
            this._glManager.getGl().LINEAR
          );
        // 是否启用预处理
        if (usePremultiply) {
          this._glManager
            .getGl()
            .pixelStorei(
              this._glManager.getGl().UNPACK_PREMULTIPLY_ALPHA_WEBGL,
              1
            );
        }
        // 将像素写入纹理
        this._glManager
          .getGl()
          .texImage2D(
            this._glManager.getGl().TEXTURE_2D,
            0,
            this._glManager.getGl().RGBA,
            this._glManager.getGl().RGBA,
            this._glManager.getGl().UNSIGNED_BYTE,
            img
          );
        // 生成中间映射
        this._glManager
          .getGl()
          .generateMipmap(this._glManager.getGl().TEXTURE_2D);
        // 绑定纹理
        this._glManager
          .getGl()
          .bindTexture(this._glManager.getGl().TEXTURE_2D, null);
        const textureInfo: TextureInfo = new TextureInfo();
        if (textureInfo != null) {
          textureInfo.fileName = fileName;
          textureInfo.width = img.width;
          textureInfo.height = img.height;
          textureInfo.id = tex;
          textureInfo.img = img;
          textureInfo.usePremultply = usePremultiply;
          if (this._textures != null) {
            this._textures.pushBack(textureInfo);
          }
        }
        callback(textureInfo);
      },
      { passive: true }
    );
    img.src = fileName;
  }

  public release() {
    for (
      let ite: iterator<TextureInfo> = this._textures.begin();
      ite.notEqual(this._textures.end());
      ite.preIncrement()
    ) {
      this._glManager.getGl().deleteTexture(ite.ptr().id);
    }
    this._textures = null;
  }

  /**
   *释放图像
   *
   *释放阵列中存在的所有图像。
   */
  public releaseTextures() {
    for (let i = 0; i < this._textures.getSize(); i++) {
      this._glManager.getGl().deleteTexture(this._textures.at(i).id);
      this._textures.set(i, null);
    }

    this._textures.clear();
  }

  /**
   *释放图像
   *
   *释放指定纹理的图像。
   *@param texture  要释放的纹理
   */
  public releaseTextureByTexture(texture: WebGLTexture): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      if (this._textures.at(i).id != texture) {
        continue;
      }
      this._glManager.getGl().deleteTexture(this._textures.at(i).id);
      this._textures.set(i, null);
      this._textures.remove(i);
      break;
    }
  }

  /**
   *释放图像
   *
   *释放指定名称的图像。
   *@param fileName 要释放的图像文件路径名
   */
  public releaseTextureByFilePath(fileName: string): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      if (this._textures.at(i).fileName == fileName) {
        this._glManager.getGl().deleteTexture(this._textures.at(i).id);
        this._textures.set(i, null);
        this._textures.remove(i);
        break;
      }
    }
  }
}
