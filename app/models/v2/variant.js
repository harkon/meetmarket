/**
 * Variant model
 *
 **/

 /*
 	{
    "_id": "05458452563",
    "name": "Width:Medium,Color:Ivory,Shoe Size:6.5",
    "lname": "width:medium,color:ivory,shoe size:6.5",
    "itemId": "054VA72303012P",
    "altIds": {
        "upc": "632576103580"
    },
    "assets": {
        "imgs": [
            {
                "width": "1900",
                "height": "1900",
                "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945348512"
            },
            {
                "width": "1900",
                "height": "1900",
                "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945348612"
            }
        ]
    },
    "attrs": [
        {
            "name": "Width",
            "value": "Medium"
        },
        {
            "name": "Color",
            "family": "White",
            "value": "Ivory"
        },
        {
            "name": "6.5",
            "value": "6.5"
        }
    ]
}

*/

/*

	Fields of interest:
	------------------
	_id: the SKU
	itemId: the parent item id.
	attrs: a list of attributes specific to the variant. Note that some of the attributes may have both a specific value (e.g. ivory) and a family value (e.g. white).
	assets: assets specific to the variant (e.g. image with a specific color).

	Common query parameters (indexed):
	----------------------------------
	find by SKU:
	{ _id: "the sku" }
	find by item Id:
	{ itemId: "item id" }


*/

