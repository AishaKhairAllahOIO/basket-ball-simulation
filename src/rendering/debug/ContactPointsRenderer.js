import * as THREE from "three";

export class ContactPointsRenderer {
  constructor(scene) {
    this.scene = scene;
    this.points = [];
  }

  add(position) {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.03,
        8,
        8
      ),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );

    marker.position.copy(position);

    this.scene.add(marker);

    this.points.push(marker);
  }

  clear() {
    for (const point of this.points) {
      this.scene.remove(point);
    }

    this.points.length = 0;
  }
}