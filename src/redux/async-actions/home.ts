import { AnyAction, Dispatch } from "redux";
import { commonFetchSuccessCode } from "../../api/fetch";
import { getHomeBanner } from "../../api/home";
import { getPartitions } from "../../api/partitions";
import { getRankingsById } from "../../api/ranking";
import { createPartitionTypeArray } from "../../models/partitionType";
import { createVideoByRanking } from "../../models/video";
import { setBanners, setOneLevelPartitions, setRankingVideos } from "../actions";

export default function getAsyncIndexContent(){
  // dispatch由thunkMiddleware传入
  return (dispatch: Dispatch<AnyAction>) => {
    const promises = [
      getPartitions(),
      getHomeBanner(),
      getRankingsById(0),
    ];
    return Promise.all(promises).then(([result1, result2, result3]) => {
      console.log(result1, result2, result3);
      if(result1.code === commonFetchSuccessCode) {
        // 获取分类数据
        const partitions = result1.data['0'];
        const oneLevelPartitions = createPartitionTypeArray(partitions);
        // 过滤fanju/dianying/dianshiju/jilupian
        const filterArr = oneLevelPartitions.filter(partition => ![13, 23, 11, 177].includes(partition.id))
        dispatch(setOneLevelPartitions(filterArr));
      }
      if(result2.code === commonFetchSuccessCode){
        // 获取banner数据
        const banners = result2.data;
        if(banners){
          const handledBanners = banners.map(banner => {
            const { id, name, pic, url } = banner;
            return { id, name, pic, url }
          });
          dispatch(setBanners(handledBanners));
        }
      }
      if(result3.code === commonFetchSuccessCode) {
        // video数据
        const list = result3.data && result3.data.list;
        if(list) {
          const rankingVideos = list.map(item => createVideoByRanking(item));
          dispatch(setRankingVideos(rankingVideos));
        }
      }
    })
  }
}