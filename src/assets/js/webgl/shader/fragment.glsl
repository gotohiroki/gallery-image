// テクスチャをメッシュにフィットさせつつ、アスペクト比を保ちながら変換
precision highp float;  // 浮動小数点演算の精度を指定

uniform sampler2D uTexture;  // テクスチャをサンプリングするためのuniform変数
uniform vec2 uMeshsize;  // メッシュのサイズ（幅と高さ）
uniform vec2 uTexturesize;  // テクスチャのサイズ（幅と高さ）

varying vec2 vUv;  // 頂点シェーダーから補間されたテクスチャ座標

void main() {
  // メッシュサイズとテクスチャサイズのアスペクト比を考慮して、テクスチャ座標の比率を計算
  vec2 ratio = vec2(
    min((uMeshsize.x / uMeshsize.y) / (uTexturesize.x / uTexturesize.y), 1.0),
    min((uMeshsize.y / uMeshsize.x) / (uTexturesize.y / uTexturesize.x), 1.0)
  );

  // テクスチャ座標をメッシュサイズに合わせて変換
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // 中心を原点にしてメッシュサイズに合わせて座標を変換
  uv -= 0.5;
  uv *= ratio;
  uv += 0.5;

  // テクスチャをサンプリングし、フラグメントの色として設定
  vec4 texture = texture2D(uTexture, uv);
  gl_FragColor = vec4(texture);
}