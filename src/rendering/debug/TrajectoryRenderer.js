import * as THREE from "three";

export class TrajectoryRenderer {
  constructor(scene) {
    this.scene = scene;

    this.material =
      new THREE.LineBasicMaterial({
        color: 0xffff00,
      });

    this.line = null;
  }

  render(points) {
    if (this.line) {
      this.scene.remove(this.line);
    }

    const geometry =
      new THREE.BufferGeometry()
        .setFromPoints(points);

    this.line = new THREE.Line(
      geometry,
      this.material
    );

    this.scene.add(this.line);
  }

  clear() {
    if (this.line) {
      this.scene.remove(this.line);
      this.line = null;
    }
  }
}