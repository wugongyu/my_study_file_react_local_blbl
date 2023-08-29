import * as actionTypes from './actionsTypes';
import { AnyAction, combineReducers } from 'redux';

const initState = {
  shouldLoad: false,
  oneLevelPartitions: [],
  banners: [],
  rankingVideos: []
};

function combineShouldLoad(shouldLoad = initState.shouldLoad, action: AnyAction){
  switch (action.type) {
    case actionTypes.SET_SHOULD_LOAD:
      return action.shouldLoad;
    default:
      return shouldLoad;
  }
}

function combineOneLevelPartitions(oneLevelPartitions = initState.oneLevelPartitions, action: AnyAction){
  switch (action.type) {
    case actionTypes.SET_ONE_LEVEL_PARTITIONS:
      return action.oneLevelPartitions;
    default:
      return oneLevelPartitions;
  }
}

function combineBanners(banners = initState.banners, action: AnyAction) {
  switch (action.type) {
    case actionTypes.SET_BANNERS:
      return action.banners;
    default:
      return banners;
  }
}

function combineRankingVideos(rankingVideos = initState.rankingVideos, action: AnyAction){
  switch (action.type) {
    case actionTypes.SET_RANKING_VIDEOS:
      return action.rankingVideos;
    default:
      return rankingVideos;
  }
}

const reducer = combineReducers({
  shouldLoad: combineShouldLoad,
  oneLevelPartitions: combineOneLevelPartitions,
  banners: combineBanners,
  rankingVideos: combineRankingVideos,
});

export default reducer;