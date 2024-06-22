const paiseToRupee = (paise) => {
  return paise ? Number(paise) * 100 : 0;
};

module.exports = { paiseToRupee };
