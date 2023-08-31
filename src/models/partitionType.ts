import { assignPropsToTarget } from ".";

/**
 * 定义【分类】对象的数据结构
 * */
type PartitionTypeDataItemProps = {
  tid: number;
  typename: string;
  children: PartitionTypeDataItemProps[],
}
type PartitionTypeDataProps = Record<string, Array<PartitionTypeDataItemProps>>;

type PartitionTypeProps = {
  id: number;
  name: string;
  children?: PartitionTypeProps[];
}
class PartitionType{
  public id: number;
  public name: string;
  public children: PartitionType[] = [];
  constructor(props: PartitionTypeProps){
    assignPropsToTarget(props, this);
  }
}

function createPartitionTypeChildren(data: PartitionTypeDataItemProps[]): PartitionType[]{
  return data.map(item => new PartitionType({
    id: item.tid, 
    name: item.typename
  }));
}

function createPartitionTypeArray(data: PartitionTypeDataProps){
  let typesArray = [];
  if(data){
    const firstTypes = data['0'];
    if(firstTypes){
      typesArray = firstTypes.map(item => {
        const id = item.tid;
        const children = createPartitionTypeChildren(data[id]);
        return new PartitionType({
          id,
          name: item.typename,
          children
        });
      })
    }
  }
  return typesArray;
}

export {
  PartitionType,
  createPartitionTypeChildren,
  createPartitionTypeArray,
}