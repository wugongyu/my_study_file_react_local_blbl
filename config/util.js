// autoprefixer -- 自动管理浏览器前缀的插件，可以解析css文件并且添加前缀到css内容里，一般结合postcss使用
const autoprefixer = require('autoprefixer');
//postcss-flexbugs-fixes -- 解决 Flexbox（弹性布局）在旧版本的浏览器中无法正确显示的问题
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
// mini-css-extract-plugin--从css文件中提取css代码到单独的文件中，对css代码进行代码压缩等
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/**
 * cssloader 处理函数
 * */ 
const cssLoadersHandler = function(options){
  options = options || {};
  // common loader
  const commonCssLoader = {
    loader: 'css-loader',
    options: !options.modules ? {
      sourceMap: options.sourceMap,
    } : {
      sourceMap: options.sourceMap,
      camelCase: true,
      modules: true,
      localIndentName: '[name]_[local]-[hash:base64:5]',
    }
  };
  const commonPostCssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      ident: 'postcss',
      plugins: () => [
        autoprefixer({flexbox: 'no-2009'}),
        postcssFlexbugsFixes,
      ],
    },
  };

  const generateLoaders = function(loaderName, loaderOptions){
    const loaders = options.usePostCSS ? [commonCssLoader, commonPostCssLoader] : [commonCssLoader];
    if(loaderName){
      loaders.push({
        loader: loaderName + '-loader',
        options: Object.assign({}, loaderOptions, 
          { sourceMap: options.sourceMap }),
      })
    }
    // 生产环境需对css代码进行打包、压缩处理
    if(options.extract){
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
      return ['style-loader'].concat(loaders);
    }
  }
  // finally return all loaders
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
}

// export the format styleLoaders for webpack configuration
/**
 * 样式loader 处理函数
 * 
 * @param options---Object
 * @param options.modules Boolean 是否模块化
 * @param options.sourceMap Boolean 是否开启 sourceMap
 * @param options.usePostCSS Boolean 是否使用PostCSS
 * @param options.extract Boolean 是否提取css代码到单独文件中
 * @param [key: string]: any
 * */ 
module.exports.styleLoaders = function(options){
  const output = [];
  const allLoaders = cssLoadersHandler(options);

  options.modules = true;
  const allCssModuleLoaders = cssLoadersHandler(options);

  for (const key in allLoaders) {
    const currentLoader = allLoaders[key];
    const currentModuleLoader = allCssModuleLoaders[key];
    output.push({
      test: new RegExp('\\.' + key + '$'),
      oneOf: [
        {
          resourceQuery: /css-modules/,
          use: currentModuleLoader,
        }, 
        {
          use: currentLoader,
        }
      ]
    })
  }

  return output;
}

