import { readLines } from "../helpers.js";
import { equal } from "node:assert";
import _ from "lodash";

const DAY = `04`;

const getAssignments = _.unary(_.flow([_.partialRight(_.split, "-"), _.partialRight(_.map, _.toInteger)]));
const getPairs = _.unary(_.flow([_.partialRight(_.split, ","), _.partialRight(_.flatMap, getAssignments)]));

const isContained = ([mFrom, mTo, nFrom, nTo]) => (mFrom >= nFrom && mTo <= nTo) || (nFrom >= mFrom && nTo <= mTo);
const isOverlapping = ([mFrom, mTo, nFrom, nTo]) => mTo >= nFrom && mFrom <= nTo;

const part1 = (input) => _(input).map(getPairs).filter(isContained).size();

const part2 = (input) => _(input).map(getPairs).filter(isOverlapping).size();

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 2);
equal(await part1(input), 526);

equal(await part2(example), 4);
equal(await part2(input), 886);

console.log(`Day ${DAY} completed ✔️`);
