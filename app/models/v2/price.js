/**
 * Price model
 */

 /*

 	{
    "_id": "SPM8824542513_1234",
        "price": "69.99",
        "sale": {
            "salePrice": "42.72",
            "saleEndDate": "2050-12-31 23:59:59"
        },
    "lastUpdated": 1374647707394
}

*/

/*
	Fields of interest:
	-------------------
	_id: the id is built in a specific way. It is the concatenation of the item information and store information. 
		The item information is either the item id or the variant id (SKU). The store information is either the store group id or the store id.
	price: the regular price
	sale: sales information, optional

	Common queries (indexed):
	--------------------------
	find all prices by item id:
	{ _id: { "$regex": "^itemId_" } }
	find all prices by SKU (price could be at item level):
	{ _id: { "$in: [ { "$regex": "^itemId_" }, { "$regex": "^sku_" } ] }
	find price for a given SKU and store (4 combinations are possible):
	{ _id: { "$in: [ "itemId_storeGroupId", "itemId_storeId", "sku_storeGroupId", "sku_storeId" ] }
	find items on sale, starting with ones ending soonest:
	{ "sale.saleEndDate": { $ne: null } } with sort by { "sale.saleEndDate": 1 } (sparse index on "sale.saleEndDate")

*/