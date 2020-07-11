{
AllCatalos: getCatalogs{
...Catalog
}
CatalogOne: getCatalog(id:"5f0983225760622c2c361d8c")
{
...Catalog
mysqlId
}
CatalogTwo: getCatalog(id:"5f0983435760622c2c361d8d")
{
...Catalog
}
}

fragment Catalog on Catalog
{
\_id
name
}
