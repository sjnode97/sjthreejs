precision lowp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
// highp  -2 16次
// mediump
// lowp
uniform float uTime;
varying float vEv;
void main(){
    vUv = uv;
    vec4 modelosition = modelMatrix * vec4( position, 1.0 );
    /**modelosition.x += 1.0;
    modelosition.z += 1.0;*/

    modelosition.z = sin((modelosition.x+uTime) * 10.0) * 0.05;
    modelosition.z += sin((modelosition.y+uTime) * 10.0) * 0.05;
    vEv = modelosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelosition;
}