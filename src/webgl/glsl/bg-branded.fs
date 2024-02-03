uniform float uTime;
varying vec2 vUv;
varying vec3 vColour;

void main() {
	// vec3 c = vec3(vUv, 0.0);

	// gl_FragColor = vec4( c, 1.0 );

	gl_FragColor = vec4( vColour, 1.0 );
}
