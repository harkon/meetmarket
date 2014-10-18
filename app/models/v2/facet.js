/**
 * Facet model
 */

 /*

	{
	    "_id": "accessory type=hosiery",
	    "name": "Accessory Type",
	    "value": "Hosiery",
	    "count": 14
	}

*/

/*

	Fields of interest:
	-------------------
	_id: the id, which is a concatenation of lower-cased facet name and value.
	name: the facet name with original casing, e.g. “Accessory Type”
	value: the facet value with original casing, e.g. “Hosiery”. Important note: here the value should be the family value is 
	possible, e.g. “White” rather than “Ivory”. Those facets will be used for searching items, and the family value is better for that purpose.
	count: the number of items that have this facet. This count will be important in defining the order of attributes in a 
	query when doing faceted search.
	
	Common query parameters (indexed):
	---------------------------------
	find a specific facet:
	{ _id: "name_value" }
	find facets for a name:
	{ _id: { $regex: "^name_" } }


*/