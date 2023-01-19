const { defineConfig } = require('@vue/cli-service')
const path = require("path");
module.exports = defineConfig({
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.glsl$/,
          loader: 'webpack-glsl-loader'
        },
        {
          test: /\.(glb|gltf)$/,
          use:
              [
                {
                  loader: 'file-loader',
                  options:
                      {
                        outputPath: 'assets/models/'
                      }
                }
              ]
        },
      ]
    },
  },
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    allowedHosts: "all",
    open: true,
    port: 3001, // 本机端口
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/styles/index.less")]
    }
  }
})
