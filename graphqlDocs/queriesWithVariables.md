mutation relateItemWithCatalog($catalog: ID!, $item:ID!)
{
relateItemsToCatalog(catalogID: $catalog, itemID: $item)
{
\_id
name
}
}

<!-- Variable Section -->

{
"catalog": "5f0983545760622c2c361d8e",
"item": "5f09af6683340d38c0e91dd9"
}
