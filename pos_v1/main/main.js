'use strict';

function printReceipt(tags) {

  const allItems = loadAllItems();
  const cartItems = buildCartItems(tags, allItems);

  const allPromotions = loadPromotions();
  const receiptItems = buildReceiptItems(cartItems, allPromotions);

  const receipt = buildReceipt(receiptItems);

  const receiptText = buildReceiptText(receipt);

  console.log(receiptText);
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
      cartItems.push({item, count});
    }
  }

  return cartItems;
}

function buildReceiptItems(cartItems, allPromotions) {
  return cartItems.map((cartItem) => {

    const promotionType = findPromotionType(cartItem.item.barcode, allPromotions);

    const {saved, subtotal} = discount(cartItem.count, cartItem.item.price, promotionType);

    return {cartItem, saved, subtotal};
  });
}

function discount(count, price, promotionType) {

  let saved = 0;

  let subtotal = count * price;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    saved = parseInt(count / 3) * price;
    subtotal -= saved;
  }

  return {saved, subtotal};
}

function findPromotionType(barcode, promotions) {

  const promotion = promotions.find(promotion => promotion.barcodes.some(b => b === barcode));

  if (promotion) {
    return promotion.type;
  }
}

function buildReceipt(receiptItems) {

  let total = 0;
  let savedTotal = 0;

  for (const receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    savedTotal += receiptItem.saved;
  }

  return {
    receiptItems: receiptItems,
    total: total,
    savedTotal: savedTotal
  }
}

function buildReceiptText(receipt) {

  let receiptItemsText = '';

  for (const receiptItem of receipt.receiptItems) {
    const cartItem = receiptItem.cartItem;
    receiptItemsText += `名称：${cartItem.item.name}，数量：${cartItem.count}${cartItem.item.unit}，单价：${formatPrice(cartItem.item.price)}(元)，小计：${formatPrice(receiptItem.subtotal)}(元)\n`;
  }

  return `***<没钱赚商店>收据***
${receiptItemsText}\
----------------------
总计：${formatPrice(receipt.total)}(元)
节省：${formatPrice(receipt.savedTotal)}(元)
**********************`;
}

function formatPrice(price) {
  return price.toFixed(2);
}
