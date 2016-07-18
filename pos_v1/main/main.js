'use strict';

function printReceipt(tags) {

  const allItems = loadAllItems();
  const cartItems = buildCartItems(tags, allItems);

  const allPromotions = loadPromotions();
  const receiptItems = buildReceiptItems(cartItems, allPromotions);
}

function buildCartItems(tags, allItems) {

  const cartItems = [];

  for (const tag of tags) {

    const tagArray = tag.split('-');
    const barcode = tagArray[0];
    const count = parseFloat(tagArray[1] || 1);

    const cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count++;
    } else {
      const item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
}
