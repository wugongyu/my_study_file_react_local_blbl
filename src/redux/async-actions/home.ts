import { AnyAction, Dispatch } from "redux";
import { getHomeBanner } from "../../api/home";
import { getPartitions } from "../../api/partitions";
import { getRankingsById } from "../../api/ranking";

export default function getAsyncIndexContent(){
  // dispatch由thunkMiddleware传入
  return (dispatch: Dispatch<AnyAction>) => {
    const promises = [
      getHomeBanner(),
      getPartitions(),
      getRankingsById(0),
    ];
    return Promise.all(promises).then(([result1, result2, result3]) => {
      console.log(result1, result2, result3);
    })
  }
}