const hasChildren = (node: any, childrenLabel: string) => {
  return (
    typeof node === "object" &&
    typeof node[childrenLabel] !== "undefined" &&
    node[childrenLabel].length > 0
  );
};

export const mapTree = (
  node: object,
  func: (node: any) => any,
  childrenLabel: string = "children"
) => {
  // your code:
  const newNode = func(node);

  if (!hasChildren(node, childrenLabel)) {
    return newNode;
  }

  return {
    ...newNode,
    [childrenLabel]: newNode[childrenLabel].map((j: any) =>
      mapTree(j, func, childrenLabel)
    ),
  };
};

export const reduceTree = (
  node: any,
  reducer: Function,
  init: any,
  childrenLabel: string = "children"
) => {
  const val = reducer(init, node);

  if (!hasChildren(node, childrenLabel)) {
    return val;
  }

  return node[childrenLabel].reduce(
    (prev: any, j: any) => reduceTree(j, reducer, prev),
    val
  );
};

/**
 * returns a node that matches the predicate
 * @param node the root node, can be object or array
 * @param predicate function that returns true if the node matches
 * @param childrenLabel property name of the children array
 * @returns traget node or null if not found
 */
export const findNode = (
  node: any,
  predicate: Function,
  childrenLabel: string = "children"
): any | null => {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const result = findNode(
        node[i],
        predicate,
        childrenLabel
      );
      if (result) {
        return result;
      }
    }
    return null;
  }

  if (predicate(node)) {
    return node;
  }

  if (!hasChildren(node, childrenLabel)) {
    return null;
  }

  for (let i = 0; i < node[childrenLabel].length; i++) {
    const result = findNode(
      node[childrenLabel][i],
      predicate,
      childrenLabel
    );
    if (result) {
      return result;
    }
  }

  return null;
};

export const deleteNodes = (
  node: any,
  predicate: Function,
  childrenLabel: string = "children"
): null => {
  /* delete all nodes that match the predicate */

  const inner = (
    node: any,
    predicate: Function,
    childrenLabel: string
  ) => {
    if (!hasChildren(node, childrenLabel)) {
      // nothing to do with this node
      return null;
    }
    for (let i = 0; i < node[childrenLabel].length; i++) {
      if (predicate(node[childrenLabel][i])) {
        node[childrenLabel].splice(i, 1);
      } else {
        deleteNodes(
          node[childrenLabel][i],
          predicate,
          childrenLabel
        );
      }
    }
  };

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      inner(node[i], predicate, childrenLabel);
    }
  }

  if (typeof node === "object") {
    inner(node, predicate, childrenLabel);
  }

  return null;
};

/**
 * takes in duration in seconds and returns a string in the format hh:mm:ss
 * or mm:ss if hours === 0. also supports negative durations.
 *
 * @param durationInSeconds {number} duration in seconds, can be negative
 * @returns {string} duration in the format hh:mm:ss or mm:ss
 */
export const formatDuration = (
  durationInSeconds: number
) => {
  const isPositive = durationInSeconds >= 0;
  durationInSeconds = Math.abs(durationInSeconds);

  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor(
    (durationInSeconds - hours * 3600) / 60
  );
  const seconds =
    durationInSeconds - hours * 3600 - minutes * 60;

  const hoursStr =
    (hours > 0 && hours.toString().padStart(2, "0")) || "";
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");

  let durationInSecondsStr = `${minutesStr}:${secondsStr}`;
  if (hoursStr) {
    durationInSecondsStr = `${hoursStr}:${durationInSecondsStr}`;
  }

  if (!isPositive) {
    durationInSecondsStr = "-" + durationInSecondsStr;
  }

  return durationInSecondsStr;
};
