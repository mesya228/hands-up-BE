import type {Config} from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;