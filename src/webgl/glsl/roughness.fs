#include <packing>

varying vec2 vUv;
varying vec3 vPos;

void main() {
  float d = vPos.z / 2.0;
  gl_FragColor.rgb = vec3(d, d, d);
  // gl_FragColor.rgb = vec3( 0.0, 0.0, 1.0 );
  gl_FragColor.a = 1.0;
}