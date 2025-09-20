#! /usr/bin/env node

import { transpileSrc } from '@turacode/core';
import { readFileSync } from 'fs';

const input = process.argv[2]
  ? readFileSync(process.argv[2], 'utf-8')
  : readFileSync(0, 'utf-8');

const js = transpileSrc(input);

eval(js);
