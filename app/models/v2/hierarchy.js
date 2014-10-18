/**
 * Hierarchy model
 */

 /*

 	{
    "_id": "1200003270",
    "name": "Women's Heels & Pumps",
    "count": 223,
    "parents": [
        "1282094266"
    ],
    "facets": [
        "Heel Height",
        "Toe",
        "Upper Material",
        "Width",
        "Shoe Size",
        "Color"
    ]
}

*/

/*
	Fields of interest:
	-------------------
	_id: the category id
	name: the category name
	count: the number of items in this category. It can be a useful statistic to display.
	parents: list of parent nodes. Simpler implementations could make use of a single value.
	facets: list of facets that exist for this category (e.g. color, size). 
	This info will be used when displaying the facets available in the searching page.

	Common queries (indexed):
	--------------------------
	find by parent id:
	{ p: "parent id" }
	find top level departments:
	{ p: null }

*/