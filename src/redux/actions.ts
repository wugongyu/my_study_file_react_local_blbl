import * as actionsTypes from './actionsTypes';
import { AnyAction } from 'redux';

export function setShouldLoad(shouldLoad: boolean): AnyAction {
  return { type: actionsTypes.SET_SHOULD_LOAD, shouldLoad };
}

export function setBanners(banners: Array<any>): AnyAction {
  return { type: actionsTypes.SET_BANNERS, banners };
}

export function setOneLevelPartitions(oneLevelPartitions: Array<any>): AnyAction{
  return { type: actionsTypes.SET_ONE_LEVEL_PARTITIONS, oneLevelPartitions };
}

export function setRankingVideos(rankingVideos: Array<any>): AnyAction{
  return { type: actionsTypes.SET_RANKING_VIDEOS, rankingVideos };
}


