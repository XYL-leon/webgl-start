<script setup>
// WebGL封装
import { onMounted, inject, nextTick } from "vue";

const gl = inject("gl");

function initShader(gl, vertexShaderSource, fragmentShaderSource) {
  // 创建顶点着色器对象
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // 创建片元着色器对象
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  // 引入顶点、片元着色器代码
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  // 编译顶点、片元着色器
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  // 创建程序对象program
  var program = gl.createProgram();
  // 附着顶点着色器、片元着色器到program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // 链接program
  gl.linkProgram(program);
  // 使用program
  gl.useProgram(program);
  return program;
}
onMounted(async () => {
  await nextTick();
  // 顶点着色器
  var vertexShaderSource = `
        void main(){
            gl_PointSize = 30.0;
            gl_Position = vec4(0.0,0.0,0.0,1.0);
        }
    `;
  // 片元着色器
  var fragShaderSource = `
        void main(){
            gl_FragColor = vec4(0.0,0.0,1.0,1.0);
        }
    `;
  // 初始化着色器
  var program = initShader(gl.value, vertexShaderSource, fragShaderSource);

  gl.value.drawArrays(gl.value.POINTS, 0, 1);
});
</script>
<template></template>
