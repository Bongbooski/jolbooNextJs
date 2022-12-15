import * as modules from "./modules";

type sampleKey = typeof modules.sample[number];

const sampleKey = modules.sample.reduce((acc, curr) => {
    acc[curr] = "sample_" + curr;
    return acc;
}, {} as Record<sampleKey, string>);

export const KEY = {
    sample: sampleKey
} as const;

export default KEY;