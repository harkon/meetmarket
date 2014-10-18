/**
 * Product summury model
 */

 /*

 	{
    "_id": "3ZZVA46759401P",
    "name": "Women's Chic - Black Velvet Suede",
    "lname": "women's chic - black velvet suede",
    "dep": "84700",
    "cat": "/84700/80009/1282094266/1200003270",
    "desc": [
        {
            "lang": "en",
            "val": "This pointy toe slingback features a high quality upper and a classy, simple silhouette. This heel has a classic shape, an adjustable ankle strap for a vintage feel and a secure fit. The Chic is the perfect combination between dressy and professional."
        }
    ],
    "img": [
        {
            "height": "330",
            "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_591726201",
            "title": "spin_prod_591726201",
            "width": "450"
        }
    ],
    "attrs": [
        "heel height=mid (1-3/4 to 2-1/4 in.)",
        "brand=metaphor"
    ],
    "sattrs": [
        "upper material=synthetic",
        "toe=open toe"
    ],
    "vars": [
        {
            "id": "05497884001",
            "img": [
                {
                    "height": "400",
                    "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_591726301",
                    "title": "spin_prod_591726301",
                    "width": "450"
                }
            ],
            "attrs": [
                "width=medium",
                "color=black",
                "shoe size=6"
            ]
        },
        {
            "id": "05497884002",
            "img": [
                {
                    "height": "400",
                    "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_591726301",
                    "title": "spin_prod_591726301",
                    "width": "450"
                }
            ],
            "attrs": [
                "width=medium",
                "color=black",
                "shoe size=6.5"
            ]
        },
        {
            "id": "05497884004",
            "img": [
                {
                    "height": "400",
                    "src": "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_591726301",
                    "title": "spin_prod_591726301",
                    "width": "450"
                }
            ],
            "attrs": [
                "width=medium",
                "color=black",
                "shoe size=7.5"
            ]
        }
    ]
}

*/

/*

	Fields of interest:

	_id: the item id
	name: the item name
	lname: the item name, lower-case
	img: list of images, ideally just the thumbnail
	dep: the department (top level of category). Needs to be separate for proper indexing
	cat: the category path
	attrs: the item attributes, to be indexed
	sattrs: the item secondary attributes, not to be indexed
	vars: list of variants
	vars.id: the variant sku
	vars.attrs: the variant attributes, to be indexed
	vars.sattrs: the secondary variant attributes, not to be indexed
	Indices:

	department + attr + category + _id
	department + vars.attrs + category + _id
	department + category + _id
	department + price + _id
	department + rating + _id


*/

/*
	Common queries (indexed):

	find by department:
	{ dep: "department" }
	find by category prefix:
	{ dep: "department", cat: { $regex: "^category prefix"} }
	find by item attribute:
	{ dep: "department", attrs: "name=value" }
	find by several item attributes:
	{ dep: "department", attrs: { $all: [ "name=value", ... ] }
	find by variant attribute:
	{ dep: "department", vars.attrs: "name=value" }
	find by several variant attributes:
	{ dep: "department", vars.attrs: { $all: [ "name=value", ... ] }
	find by item attributes, variant attributes, category:
	{ dep: "department", attrs: { $all: [ "name=value", ... ], vars.attrs: { $all: [ "name=value", ... ], cat: { $regex: "^category prefix"} }

*/


/*

	A few interesting notes on indexing / querying:

	each index starts with the department, which is a convenient way to subdivide our product catalog. It is an acceptable 
	restriction to force the user to pick a department before displaying any kind of search facet (unless we’re displaying 
	a pre-computed list like “most popular”). Hence having the department there will ensure that there is always a large 
	amount of filtering done for cheap by the index :)
	each index ends with “_id” which is useful for pagination. It will give sorting on _id for free for some common queries. 
	It’s always better to avoid resorting the skip/limit for pagination, which is only fine for a low number of pages.
	for queries using “$all“ the most restrictive attribute should be specified first (e.g. “color=red”). This information can 
	be inferred from the “facet“ collection described earlier. This piece is critical to make facetted searches efficient and 
	keep them in the few milliseconds.

*/
