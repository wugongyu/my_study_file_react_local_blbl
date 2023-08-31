import { assignPropsToTarget } from ".";

type UpUserProps = {
  mid: number;
  name: string;
  face: string;
  level?: number;
  sex?: string;
  sign?: string;
  following?: number;
  follower?: number;
}

class UpUser{
  public mid: number;
  public name: string;
  public face: string;
  public level: number = 0;
  public sex: string = "保密";
  public sign: string = "";
  public following: number = 0;
  public follower: number = 0;
  constructor(props: UpUserProps){
    assignPropsToTarget(props, this);
  }
}

export {
  UpUser,
}