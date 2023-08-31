import { assignPropsToTarget } from "./index";
import { PartitionType } from "./partitionType";
import { UpUser } from "./upUser";

type VideoProps = {
  aid: number;
  title: string;
  pic: string;
  desc: string;
  playCount: number;
  barrageCount: number;
  publicDate: number;
  duration: any;
  cid: number;
  url: string;
  owner: UpUser;
  twoLevel?: PartitionType;
  oneLevel?: PartitionType;
}

type StatDataProps = {
  view: number;
  danmaku: number;
}
type OwnerDataProps = {
  mid: number;
  name: string,
  face: string;
}
interface CreateVideoDataProps {
  aid: number;
  cid: number;
  tid: number;
  tname: string;
  title: string;
  pic: string;
  desc?: string;
  stat:  StatDataProps;
  pubdate: number;
  duration: any;
  initUrl?: string;
  owner: OwnerDataProps;
  reid?: number;
  toptype?: string;
}
interface CreateVideoByOthersDataProps extends Partial<CreateVideoDataProps>{
  mid?: number,
  author?: string;
  face?: string;
  play?: number;
  video_review?: number;
  length?: number;
}

class Video {
  public aid: number;
  public title: string;
  public pic: string;
  public desc: string;
  public playCount: number;
  public barrageCount: number;
  public publicDate: number;
  public duration: any;
  public cid: number;
  public url: string;
  public owner: UpUser = null;
  public twoLevel: PartitionType = null;
  public oneLevel: PartitionType = null;
  constructor(props: VideoProps) {
    assignPropsToTarget(props, this);
  }
}

function createVideo(data: CreateVideoDataProps): Video {
  const { aid, title, pic, desc = '',
    stat, pubdate: publicDate, duration, cid, initUrl: url, owner,
    tid, tname, reid, toptype
  } = data;
  const { view: playCount, danmaku: barrageCount } = stat;
  return new Video({
      aid,
      title,pic,
      desc,playCount,barrageCount,
      publicDate,duration,cid,
      url: url || '',
      owner: new UpUser(owner),
      twoLevel: tid ? new PartitionType({ id: tid, name: tname }) : null,
      oneLevel: reid ? new PartitionType({ id: reid, name: toptype }) : null
    }
  );
}

function createVideoByDetail(data: CreateVideoDataProps): Video {
  const { aid, title, pic, desc = '',
    stat, pubdate: publicDate, duration, cid, owner,
    tid, tname
  } = data;
  const { view: playCount, danmaku: barrageCount } = stat;
  return new Video({
      aid,
      title,pic,
      desc,playCount,barrageCount,
      publicDate,duration,cid,
      url: '',
      owner: new UpUser(owner),
      twoLevel: tid ? new PartitionType({ id: tid, name: tname }) : null,
    }
  );
}

function createVideoByRanking(data: CreateVideoByOthersDataProps): Video {
  const { aid, title, pic,
    play: playCount, video_review: barrageCount,
    duration, author,
  } = data;
  return new Video({
      aid,
      title,
      pic,
      desc: '',
      playCount,barrageCount,
      publicDate: 0,duration,cid: 0,
      url: '',
      owner: new UpUser({ mid: 0, name: author, face: '' }),
    }
  );
}
function createVideoByLatest(data: CreateVideoByOthersDataProps): Video {
  const { aid, title, pic, desc,
    stat, cid, pubdate: publicDate,
    duration, author, mid, face
  } = data;
  const { view: playCount, danmaku: barrageCount } = stat;
  return new Video({
      aid,
      title,
      pic,
      desc,
      playCount,barrageCount,
      publicDate,duration,cid,
      url: '',
      owner: new UpUser({ mid, name: author, face }),
    }
  );
}

function createVideoByUser(data: CreateVideoByOthersDataProps): Video {
  const { aid, title, pic,
    play: playCount, video_review: barrageCount,
    author, mid
  } = data;
  return new Video({
      aid,
      title,
      pic,
      desc: '',
      playCount,barrageCount,
      publicDate: 0,duration: data.length,cid: 0,
      url: '',
      owner: new UpUser({ mid, name: author, face: '' }),
    }
  );
}

function createVideoBySearch(data: CreateVideoByOthersDataProps): Video {
  const { aid, title, pic, duration, pubdate: publicDate,
    play: playCount, video_review: barrageCount,
    author, mid
  } = data;
  const times = duration && duration.split(':');
  const seconds = times && (parseInt(times[0], 10) * 60 + parseInt(times[1], 10));
  return new Video({
      aid,
      title,
      pic,
      desc: '',
      playCount,barrageCount,
      publicDate,duration: seconds,cid: 0,
      url: '',
      owner: new UpUser({ mid, name: author, face: '' }),
    }
  );
}

export {
  Video,
  createVideo,
  createVideoByDetail,
  createVideoByRanking,
  createVideoByLatest,
  createVideoByUser,
  createVideoBySearch
}