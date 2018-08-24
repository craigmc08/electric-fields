import V from './Vector';

const Range = (min, max) => max === undefined ? Math.random() * min : Math.random() * (max - min) + min;
const Position = (min, max, minY=min, maxY=max) => V(Range(min, max), Range(minY, maxY));
const Direction = () => V.FromAngle(Range(0, 2 * Math.PI));

export default {
    Range,
    Position,
    Direction,
};