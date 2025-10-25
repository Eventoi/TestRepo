// Настройка Webpack для сборки React приложения
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Точка входа в приложение
  entry: './src/index.js',
  
  // Куда складывать собранные файлы
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  
  // Настройки для dev-сервера
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true, // для React Router
    proxy: [
      {
        context: ['/api', '/download'],
        target: 'http://localhost:8000', // Django backend
        changeOrigin: true
      }
    ]
  },
  
  // Загрузчики файлов
  module: {
    rules: [
      {
        // Обработка JS и JSX файлов через Babel
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        // Обработка CSS файлов
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  // Плагины
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  
  // Расширения файлов
  resolve: {
    extensions: ['.js', '.jsx']
  }
};