import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `07`;

class Dir {
  size = 0;
  entries = [];

  constructor({ name, parent }) {
    this.name = name;
    this.parent = parent;
  }

  addFile(name, size) {
    this.entries.push(new File({ name, size, parent: this }));
  }

  addDir(name) {
    this.entries.push(new Dir({ name, parent: this }));
  }

  findDir(name) {
    return this.entries.find((entry) => entry.name === name);
  }

  getSize() {
    return this.entries.reduce((acc, entry) => acc + entry.getSize(), 0);
  }
}

class File {
  constructor({ name, size, parent }) {
    this.name = name;
    this.size = size;
    this.parent = parent;
  }

  getSize() {
    return this.size;
  }
}

const buildTree = (commands) => {
  let tree = new Dir({ name: "/", parent: null });
  let currentDir = tree;

  for (let command of commands) {
    const { instruction, args, output } = command;
    if (instruction === "cd") {
      // ls is creating dir
      if (args === "..") {
        currentDir = currentDir.parent;
      } else {
        currentDir = currentDir.findDir(args);
      }
    } else if (instruction === "ls") {
      for (const entry of output) {
        const { size, name, type } = entry;
        if (type === "dir") {
          currentDir.addDir(name);
        } else if (type === "file") {
          currentDir.addFile(name, size);
        }
      }
    }
  }

  return tree;
};

const parseCommand = (command) => command.split(" ").filter(Boolean);

const parseCommandOutput = (output) => {
  if (output.startsWith("dir")) {
    return { type: "dir", name: R.drop(4, output) };
  } else {
    const [size, name] = R.split(" ", output);
    return { type: "file", name, size: parseInt(size, 10) };
  }
};

const parseInput = (input) =>
  R.pipe(
    R.drop(1),
    R.reduce((acc, line) => {
      if (line.startsWith("$")) {
        const [instruction, args] = parseCommand(R.drop(2, line));
        acc.push({ instruction, args, output: [] });
      } else {
        R.last(acc).output.push(parseCommandOutput(line));
      }
      return acc;
    }, [])
  )(input);

const getDirSizes = (tree) =>
  R.reduce(
    (acc, entry) => (entry instanceof File ? acc : [...acc, ...getDirSizes(entry)]),
    [{ name: tree.name, size: tree.getSize() }],
    tree.entries
  );

const part1 = (input) => {
  const commands = parseInput(input);
  const tree = buildTree(commands);
  const sizes = getDirSizes(tree);

  return R.pipe(
    R.filter((entry) => entry.size < 100000),
    R.pluck("size"),
    R.sum()
  )(sizes);
};

const part2 = (input) => {
  const commands = parseInput(input);
  const tree = buildTree(commands);
  const sizes = getDirSizes(tree);

  const rootDirSize = sizes[0].size;
  const totalSpace = 70000000;
  const requiredSpace = 30000000;
  const freeSpace = totalSpace - rootDirSize;

  return R.pipe(
    R.sortBy(R.prop("size")),
    R.find((entry) => entry.size >= requiredSpace - freeSpace),
    R.prop("size")
  )(sizes);
};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 95437);
  equal(await part1(input), 1543140);

  equal(await part2(example), 24933642);
  equal(await part2(input), 1117448);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
