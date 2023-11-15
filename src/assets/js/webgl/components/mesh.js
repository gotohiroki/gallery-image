import { Mesh, PlaneGeometry, ShaderMaterial, TextureLoader, Vector2 } from 'three';
import vertexShader from '../shader/vertex.glsl';
import fragmentShader from '../shader/fragment.glsl';

export default class Plane {
  constructor(stage, option) {
    
    this.element = option;
    this.stage = stage;

    console.log(this.element);

    this.mesh = null;

    this.meshSize = {
      x: this.element.width,
      y: this.element.height
    }

    this.texture = new TextureLoader().load(this.element.img);

    this.textureSize = {
      x: 760,
      y: 560
    }

    this.windowWidth = 0;
    this.windowHeight = 0;

    this.windowWidthHalf = 0;
    this.windowHeightHalf = 0;

    this.meshWidthHalf = 0;
    this.meshHeightHalf = 0;
  }

  init() {
    this._setWindowSize();
    this._setMesh();
    this._setMeshScale();
    this._setMeshPosition();
  }

  _setWindowSize() {
    // ウィンドウのサイズを取得し、クラス内のプロパティに設定
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.windowWidthHalf = this.windowWidth / 2;
    this.windowHeightHalf = this.windowHeight / 2;
  }

  _setMeshScale() {
    // メッシュのサイズを設定し、シェーダーマテリアルに対してもサイズ情報を更新
    this.mesh.scale.x = this.element.width;
    this.mesh.scale.y = this.element.height;

    this.material.uniforms.uMeshSize.value.x = this.mesh.scale.x;
    this.material.uniforms.uMeshSize.value.y = this.mesh.scale.y;

    this.meshWidthHalf = this.mesh.scale.x / 2;
    this.meshHeightHalf = this.mesh.scale.y / 2;
  }

  _setMeshPosition() {
    // メッシュの位置を設定
    this.mesh.position.x = -this.windowWidthHalf + this.meshWidthHalf + this.element.left;
    this.mesh.position.y = this.windowHeightHalf - this.meshHeightHalf - this.element.top;
  }

  _setStrength(strength) {
    // メッシュのシェーダーマテリアルの強度を設定
    this.mesh.material.uniforms.uStrength.value = strength;
  }

  _setMesh() {
    this.geometry = new PlaneGeometry(1.0, 1.0, 32, 32);
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTexture: { value: this.texture },
        uMeshSize: { value: new Vector2(this.meshSize.x, this.meshSize.y) },
        uTextureSize: { value: new Vector2(this.textureSize.x, this.textureSize.y) },
        uStrength: { value: 0.0 }
      }
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.stage.scene.add(this.mesh);
  }

  onResize() {
    this._setWindowSize();
  }

  _render() {
    if(this.mesh) {
      this._setMeshScale();
      this._setMeshPosition();
    }
  }

  onRaf() {
    this._render();
  }
}