const NativeSampleModule = {
  reverseString: (input: string) => input.split('').reverse().join(''),
  cubicRoot: (input: string) => {
    const num = Number(input);
    return Number.isNaN(num) ? NaN : Math.cbrt(num);
  },
  validateAddress: (address: { num: number }) => address.num > 0,
};

export default NativeSampleModule;
