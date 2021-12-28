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

  static MUTATION_deleteOnCountry(country) {
    return `mutation MyMutation {
        delete_laba3_cities(where: {country_name: {_eq: "${country}"}}) {
          returning {
            id
            city_name
            country_name
            population
          }
        }
      }`;
  }

  static MUTATION_deleteOnCity(city) {
    return `mutation MyMutation {
        delete_laba3_cities(where: {city_name: {_eq:  "${city}"}}) {
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
