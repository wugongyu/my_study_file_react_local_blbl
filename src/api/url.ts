const urlPrefix = process.env.URL_PREFIX;
/**
 * 首页
 * */ 
const URL_INDEX = urlPrefix + '/index'; // 首页内容
const URL_ROUND_SOWING = urlPrefix + '/round-sowing'; // 首页轮播图

/**
 * 分类
 */
const URL_PARTITIONS = urlPrefix + '/partitions'; // 分类
const URL_RANKING_PARTITIONS = urlPrefix + '/ranking/partitions'; // 排行榜分类

/**
 * ranking
 * */ 
const URL_RANKING = urlPrefix + '/ranking';

export {
  URL_INDEX,
  URL_ROUND_SOWING,
  URL_PARTITIONS,
  URL_RANKING_PARTITIONS,
  URL_RANKING,
}