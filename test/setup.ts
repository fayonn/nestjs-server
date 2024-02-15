import {rm} from 'fs/promises';
import {join} from 'path';

afterEach(async () => {
  try {
    await rm(join(__dirname, '..', 'sqlite-test.db'));
  } catch (err) {
    console.log(err);
  }
});