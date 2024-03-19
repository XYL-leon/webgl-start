<script setup>
import { ref, onMounted } from "vue";
const webgl = ref(null);

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
onMounted(() => {
  const canvas = webgl.value;
  const gl = canvas.getContext("webgl");
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
  var program = initShader(gl, vertexShaderSource, fragShaderSource);

  gl.drawArrays(gl.POINTS, 0, 1);
});
</script>
<template>
  <canvas ref="webgl" class="webgl" width="500" height="500"></canvas>
  <div style="width:20px;height:20px;background:red;margin:0 auto;"></div>
</template>