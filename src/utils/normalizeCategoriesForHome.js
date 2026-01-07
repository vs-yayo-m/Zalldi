export function normalizeCategoriesForHome(categoriesObject) {
  return Object.entries(categoriesObject).map(
    ([mainId, mainCat]) => ({
      id: mainId,
      name: mainCat.name,
      icon: mainCat.icon,
      color: mainCat.color,
      subcategories: Object.entries(mainCat.subcategories).map(
        ([subId, subCat]) => ({
          id: subId,
          name: subCat.name,
          image: subCat.image,
          parentId: mainId
        })
      )
    })
  );
}