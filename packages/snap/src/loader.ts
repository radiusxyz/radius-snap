import init from '../build/pvde';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  await init();
  console.log('successssss');
})();

export * from '../build/pvde';
