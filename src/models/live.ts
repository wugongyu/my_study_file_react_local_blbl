import { assignPropsToTarget } from ".";
import { UpUser } from "./upUser";

type LiveProps = {
  title: string;
  roomId: number;
  onlineNum: number;
  cover: string;
  isLive: number;
  playUrl: string;
  upUser: UpUser;
}

class Live {
  public title: string;
  public roomId: number;
  public onlineNum: number;
  public cover: string;
  public isLive: number;
  public playUrl: string;
  public upUser: UpUser;
  constructor(props: LiveProps){
    assignPropsToTarget(props, this);
  }
}

export {
  Live,
}