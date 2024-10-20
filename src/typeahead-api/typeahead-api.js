
import lookupList from './typeahead-lookup-list.json' assert { type: 'json' };

const MAX_RESULTS = 20;

class TypeaheadApi {
  toChemicalWithLowerCaseName(chemical) {
    return {
      ...chemical,
      name: chemical.name.toLowerCase()
    };
  }

  getChemicalsWithInput(input) {
    input = input.toLowerCase();
    return lookupList
      .filter(chemical => chemical.name.toLowerCase().startsWith(input))
      .slice(0, MAX_RESULTS)
      .map(chemical => this.toChemicalWithLowerCaseName(chemical))
    ;
  }
}

export const typeAheadApi = new TypeaheadApi();

//console.log(typeAheadApi.getChemicalsWithInput('a'))