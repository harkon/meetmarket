The OpenShift `nodejs` cartridge documentation can be found at:

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs


MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: p9U4GiPaaF-Q
   Database Name: shops

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/


https://www.facebook.com/dialog/pagetab?api_key=1458988301053397&next=https%3A%2F%2Fwww.facebook.com%2F





http://edgystuff.tumblr.com/post/91964246640/product-catalog-part-1-schema-design

http://www.mongodb.com/presentations/retail-reference-architecture-part-1-flexible-searchable-low-latency-product-catalog

-------
Modules
-------
	*	Merchandising
		--------------
		- Item
		- Variant
		- Hierarchy
		- Localization
		- Pricing
		- Promotions
		- Ratings and reviews
		- Calendar
		- Semantic search

			*	Collections
				-----------
				- Items
				- Variants
				- Ratings and Reviews
				- Promotions
				- Pricing
				------------> Summuries

	*	Inventory
		Stores
		Products
		Assortments
		Shipments
		Audits
		
