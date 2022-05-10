Moralis.Cloud.define("getTokensByOwerAddress", async function(request) {
  const query = new Moralis.Query("VaultTokenTransfersNew");
  const filterAddress = request.params.address?.toLowerCase();

  if (!filterAddress) {
    return [];
  }

  query.equalTo("to", filterAddress);
  const results = await query.find();

  let tokenIds = [];
  for (let i = 0; i < results.length; ++i) {
    tokenIds.push(results[i].get("tokenId"));
  }

  return tokenIds;
});
