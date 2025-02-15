const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'), // Replace contentBase with static
    compress: true,
    port: 443,
    allowedHosts: ['.chickenegghunt.site'],
    server:{type: 'https',
      options: {
       key: fs.readFileSync('./ssl/key.pem'),
       cert: fs.readFileSync('./ssl/cert.pem') 
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }, 
        { from: 'src/d3_scripts.js', to: 'd3_scripts.js'},
        { from: 'src/api.js', to: 'api.js'},
        { from: 'src/js/logisticModel.js', to: 'logisticModel.js'}
      
      ],  
    })
  ],
  module: {
    rules: [
      { test: /\.css$/, 
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Add more rules for other file types if needed
    ]
  },
};
