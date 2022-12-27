import * as modules from "./modules";

type sampleKey = typeof modules.sample[number];
type knowingKey = typeof modules.knowing[number];

const sampleKey = modules.sample.reduce((acc, curr) => {
    acc[curr] = "sample_" + curr;
    return acc;
}, {} as Record<sampleKey, string>);

const knowingKey = modules.knowing.reduce((acc, curr) => {
    acc[curr] = "knowing_" + curr;
    return acc;
}, {} as Record<knowingKey, string>);

export const KEY = {
    sample: sampleKey,
    knowing: knowingKey,
} as const;

export default KEY;