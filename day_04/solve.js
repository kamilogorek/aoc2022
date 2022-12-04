import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `04`;

const isContained = ([mFrom, mTo, nFrom, nTo]) => (mFrom >= nFrom && mTo <= nTo) || (nFrom >= mFrom && nTo <= mTo);
const isOverlapping = ([mFrom, mTo, nFrom, nTo]) => mTo >= nFrom && mFrom <= nTo;
const getPairs = R.pipe(R.split(","), R.map(R.pipe(R.split("-"), R.map(Number))), R.flatten);

const part1 = R.pipe(R.map(getPairs), R.filter(isContained), R.length);
const part2 = R.pipe(R.map(getPairs), R.filter(isOverlapping), R.length);

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 2);
equal(await part1(input), 526);

equal(await part2(example), 4);
equal(await part2(input), 886);

console.log(`Day ${DAY} completed ✔️`);
