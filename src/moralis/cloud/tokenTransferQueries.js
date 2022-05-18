Moralis.Cloud.define('getTokensByOwerAddress', async function (request) {
  const filterAddress = request.params.address?.toLowerCase();

  if (!filterAddress) {
    return [];
  }

  // Filter transfers match with `to` field
  const toQuery = new Moralis.Query('VaultTokenTransfersNew').equalTo('to', filterAddress);
  let results = await toQuery.find();

  const info = {};
  for (let i = 0; i < results.length; ++i) {
    const tokenId = results[i].get('tokenId');
    const blockNumber = Number(results[i].get('block_number'));
    if (!info[tokenId]) {
      info[tokenId] = [blockNumber];
    } else {
      info[tokenId].push(blockNumber);
    }
  }

  // Filter transfers match with `from` field
  const fromQuery = new Moralis.Query('VaultTokenTransfersNew').equalTo('from', filterAddress);
  fromQuery.equalTo('from', filterAddress);
  results = await fromQuery.find();

  for (let i = 0; i < results.length; ++i) {
    const tokenId = results[i].get('tokenId');
    const blockNumber = Number(results[i].get('block_number'));

    if (info[tokenId]) {
      const idx = info[tokenId].findIndex((x) => x <= blockNumber);
      if (idx >= 0) {
        info[tokenId].splice(idx, 1);
      }
    }
  }

  // Grab tokenIds
  const tokenIds = [];

  for (const tokenId of Object.keys(info)) {
    if (info[tokenId].length > 0) {
      tokenIds.push(tokenId);
    }
  }

  return tokenIds;
});

/**
1: [200, 201],
2: [180, 201],
 */
