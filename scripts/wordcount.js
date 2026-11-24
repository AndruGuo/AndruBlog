'use strict';

// 本地实现字数/阅读时长统计助手（替代不兼容 Hexo 7 的 hexo-wordcount 插件）

function count(text) {
  text = (text || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s\s/g, '')
    .replace(/\W\s/g, '');
  var cn = text.match(/[\u4E00-\u9FA5]/g) || [];
  var en = text.match(/(\W*\w*\W)/g) || [];
  return { cn: cn.length, en: en.length, total: cn.length + en.length };
}

function minutes(n, awl, wpm) {
  var m = Math.round(n / (awl * wpm));
  return m < 1 ? 1 : m;
}

module.exports = function (hexo) {
  var cfg = hexo.config.symbols_count_time || {};
  var awl = cfg.awl || 4;
  var wpm = cfg.wpm || 275;

  hexo.extend.helper.register('wordcount', function (content) {
    return count(content).total;
  });

  hexo.extend.helper.register('symbolsCount', function (post) {
    return count(post && post.content).total;
  });

  hexo.extend.helper.register('min2read', function (content) {
    return minutes(count(content).total, awl, wpm);
  });

  hexo.extend.helper.register('symbolsCountTotal', function (site) {
    var posts = site ? site.posts : hexo.locals.get('posts');
    var n = 0;
    posts.each(function (post) { n += count(post.content).total; });
    return n;
  });

  hexo.extend.helper.register('min2readTotal', function (site) {
    var posts = site ? site.posts : hexo.locals.get('posts');
    var n = 0;
    posts.each(function (post) { n += count(post.content).total; });
    return minutes(n, awl, wpm);
  });
};
