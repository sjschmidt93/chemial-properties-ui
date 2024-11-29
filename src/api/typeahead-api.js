
import lookupList from './typeahead-lookup-list.json' assert { type: 'json' };

const MAX_RESULTS = 20;

class TypeaheadApi {
  getChemicalsWithInput(input) {
    input = input.toLowerCase();

    const fullLookUpList = [
      ...lookupList.map(chemical => chemical.name?.toLowerCase()),
      ...lookupList.map(chemical => chemical.iupacName?.toLowerCase()),
      ...lookupList.map(chemical => chemical.inchiKey.toLowerCase())
    ].filter(name => name !== undefined);

    return fullLookUpList
      .filter(name => name.startsWith(input))
      .slice(0, MAX_RESULTS).map(name => {
        const inchiKey = lookupList.find(chemical => 
          chemical.name?.toLowerCase() === name.toLowerCase() || 
          chemical.iupacName?.toLowerCase() === name.toLowerCase() || 
          chemical.inchiKey.toLowerCase() === name.toLowerCase()
        )?.inchiKey;
        return { 
          name: name.toUpperCase() === inchiKey ? name.toUpperCase() : name,
          inchiKey
        }
      })
  }
}

export const typeAheadApi = new TypeaheadApi();
