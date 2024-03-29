/**
 * Item model
 *
 **/

/**
 	{
    "_id": "054VA72303012P",
    "desc": [
        {
            "lang": "en",
            "val": "Give your dressy look a lift with these women's Kate high-heel shoes by Metaphor. These playful peep-toe pumps feature satin-wrapped stiletto heels and chiffon pompoms at the toes. Rhinestones on each of the silvertone buckles add just a touch of sparkle to these shoes for a flirty footwear look that's made for your next night out."
        }
    ],
    "name": "Women's Kate Ivory Peep-Toe Stiletto Heel",
    "lname": "women's kate ivory peep-toe stiletto heel",
    "category": "/84700/80009/1282094266/1200003270",
    "brand": {
        "id": "2483510",
        "img": {
            "src": "http://i.sears.com/s/i/bl/image/spin_prod_metadata_168138610"
        },
        "name": "Metaphor"
    },
    "assets": {
        "imgs": [
            {
                "img": {
                    "height": "1900",
                    "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_967112812",
                    "width": "1900"
                }
            },
            {
                "img": {
                    "height": "1900",
                    "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945877912",
                    "width": "1900"
                }
            },
            {
                "img": {
                    "height": "1900",
                    "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945878012",
                    "width": "1900"
                }
            }
        ]
    },
    "shipping": {
        "dimensions": {
            "height": "13.0",
            "length": "1.8",
            "width": "26.8"
        },
        "weight": "1.75"
    },
    "specs": [
        {
            "name": "Heel Height (in.)",
            "val": "3.75"
        }
    ],
    "attrs": [
        {
            "name": "Heel Height",
            "value": "High (2-1/2 to 4 in.)"
        },
        {
            "name": "Upper Material",
            "value": "Synthetic"
        },
        {
            "name": "Toe",
            "value": "Open toe"
        }
        {
            "name": "Brand",
            "value": "Metaphor"
        }
    ],
    "variants": {
        "cnt": 9,
        "attrs": [
            {
                "dispType": "COMBOBOX",
                "name": "Width",
            },
            {
                "dispType": "DROPDOWN",
                "name": "Color",
            },
            {
                "dispType": "DROPDOWN",
                "name": "Shoe Size",
            }
        ]
    },
    "lastUpdated": 1400877254787
}

**/

/**
	Fields of interest:
	-------------------
	_id: the product id
	lastUpdated: useful timestamp to see recently updated
	category: the category path made up of hierarchy nodes
	name: the product name
	lname: a lower-case version of the name. This can be useful for doing case-insensitive matching with an index
	brand: the brand
	desc: list of descriptions (website, retail box, etc)
	assets: list of assets (images, etc)
	attrs: list of attributes as name-value pairs. Will be used to implement facetting. Note that the brand is also included as one attribute.
	variants: some information on variants, but not the variants themselves

	Common queries (indexed):
	-------------------------
	find by id:
	{ _id: "the product id" }
	find by category prefix:
	{ product.cat: { $regex: "^category prefix" } }
	find by case-insensitive name prefix:
	{ product.lname: { $regex: "^name prefix" } }


**/