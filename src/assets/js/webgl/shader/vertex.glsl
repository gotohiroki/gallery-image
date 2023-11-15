uniform float uStrength;
varying vec2 vUv;

float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv;

  vec3 pos = position;
  
  // 頂点のテクスチャ座標（UV座標）を uvCurve にコピー
  vec2 uvCurve = uv;
  
  // uvCurve.x を使って sin 関数を適用し、その結果を uStrength でスケーリングして curve に格納します。
  // これにより、曲線が得られます。vec3(0.0, ... , 0.0) のように y 軸方向以外の成分は変化させず、平面上での変位が行われます。
  vec3 curve = vec3(0.0, sin( uvCurve.x * PI ) * uStrength, 0.0);
  
  // 頂点の座標に curve を適用して変位させます。0.0025 は変位のスケールを表しています。
  pos += curve * 0.0025;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}