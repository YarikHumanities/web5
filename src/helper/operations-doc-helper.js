export class OperationsDocHelper {
  static QUERY_get_all() {
    return `
    query MyQuery {
      laba3_cities {
        city_name
        country_name
        id
        population
      }
    }
  `;
  }

  static MUTATION_insert(name, country, people) {
    return `mutation MyMutation {
        insert_laba3_cities(objects: {city_name: "${name}", country_name: "${country}", population: "${people}"}) {
          returning {
            id
            city_name
            country_name
            population
          }
        }
      }`;
  }

  static MUTATION_deleteOnID(id) {
    return `mutation MyMutation {
        delete_laba3_cities(where: {id: {_eq:  "${id}"}}) {
          returning {
            id
            city_name
            country_name
            population
          }
        }
      }`;
  }
}
