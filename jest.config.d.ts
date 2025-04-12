declare const _default: {
    preset: string;
    moduleFileExtensions: string[];
    rootDir: string;
    testRegex: string;
    transform: {
        '^.+\\.(t|j)s$': (string | {
            useESM: boolean;
        })[];
    };
    transformIgnorePatterns: string[];
    moduleNameMapper: {
        [key: string]: string | string[];
    } | undefined;
    collectCoverageFrom: string[];
    coverageDirectory: string;
    testEnvironment: string;
    extensionsToTreatAsEsm: string[];
};
export default _default;
