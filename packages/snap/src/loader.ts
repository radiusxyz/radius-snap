import init from '../build/delay_encryption/pvde/pvde';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  await init();
  console.log('successssss');
})();

export * from '../build/delay_encryption/pvde/pvde';
