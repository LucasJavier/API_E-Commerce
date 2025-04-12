"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_jest_1 = require("ts-jest");
const tsconfig_json_1 = require("./tsconfig.json");
exports.default = {
    preset: 'ts-jest/presets/default-esm',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': ['ts-jest', { useESM: true }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!jose/.*)'
    ],
    moduleNameMapper: (0, ts_jest_1.pathsToModuleNameMapper)(tsconfig_json_1.compilerOptions.paths, {
        prefix: '<rootDir>/../',
    }),
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
};
//# sourceMappingURL=jest.config.js.map