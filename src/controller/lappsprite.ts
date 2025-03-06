
import { LAppSubdelegate } from './lappsubdelegate';

export class Rect {
  public left: number; // 左边
  public right: number; // 右边
  public up: number; // 上边
  public down: number; // 下边
}

export class LAppSprite {
  // _texture: WebGLTexture; // テクスチャ
  // _vertexBuffer: WebGLBuffer; // 頂点バッファ
  // _uvBuffer: WebGLBuffer; // uv頂点バッファ
  // _indexBuffer: WebGLBuffer; // 頂点インデックスバッファ
  // _rect: Rect; // 矩形

  // _positionLocation: number;
  // _uvLocation: number;
  // _textureLocation: WebGLUniformLocation;

  // _positionArray: Float32Array;
  // _uvArray: Float32Array;
  // _indexArray: Uint16Array;

  // _firstDraw: boolean;

  private _subdelegate: LAppSubdelegate;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    textureId: WebGLTexture
  ) {
    // this._rect = new Rect();
    // this._rect.left = x - width * 0.5;
    // this._rect.right = x + width * 0.5;
    // this._rect.up = y + height * 0.5;
    // this._rect.down = y - height * 0.5;
    // this._texture = textureId;
    // this._vertexBuffer = null;
    // this._uvBuffer = null;
    // this._indexBuffer = null;

    // this._positionLocation = null;
    // this._uvLocation = null;
    // this._textureLocation = null;

    // this._positionArray = null;
    // this._uvArray = null;
    // this._indexArray = null;

    // this._firstDraw = true;
  }

  public setSubdelegate(subdelegate: LAppSubdelegate): void {
    this._subdelegate = subdelegate;
  }
}

