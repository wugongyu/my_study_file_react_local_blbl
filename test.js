function assignPropsToTarget(props, target){
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      target[key] = props[key];
    }
  }
}
class PartitionType {
  id;
  name;
  children = [];
  constructor(props) {
    assignPropsToTarget(props, this)
  }
}

function createPartitionTypes(data) {
  return data.map((item) => new PartitionType({
    id: item.tid,
    name:  item.typename
  }));
}

function createPartitionTypesTree(data) {
  if (data) {
    let partitionTtypes = [];
    const firstTypes = data["0"];
    if (firstTypes) {
      partitionTtypes = firstTypes.map((item) => {
        const id = item.tid;
        const children = createPartitionTypes(data["" + id]);
        return new PartitionType({
          id,
          name: item.typename,
          children
        });
      });
    }
    return partitionTtypes;
  }
}

var treeObj = 
{
  0: [
    {
      tid: 1,
      typename: "动画"
    },
    {
      tid: 13,
      typename: "番剧"
    },
  ],
  1: [
      {
      tid: 24,
      typename: "MAD·AMV"
    }
  ],
  13: [
    {
      tid: 33,
      typename: "连载动画"
    }
  ]
};

var arr = createPartitionTypesTree(treeObj);
console.log(arr);