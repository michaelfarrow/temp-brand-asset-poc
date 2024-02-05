varying vec2 vUv;
varying vec3 vPos;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vPos = position;
}