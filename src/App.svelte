<script>
  import http from "./helper/request-helper";
  import { OperationsDocHelper } from "./helper/operations-doc-helper";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import auth from "./auth-service";
  import { isAuthenticated, user, cities, token } from "./store";

  const offline = writable(false);
  window.onoffline = () => {
    offline.set(true);
  };
  window.ononline = () => {
    offline.set(false);
  };

  token.subscribe(async (value) => {
    if (value) {
      const response = await http.startFetchMyQuery(
        OperationsDocHelper.QUERY_get_all(),
      );
      
      if (response !== null) {
        cities.set(response.laba3_cities);
      }
    }
  });
  let auth0Client;
  onMount(async () => {
    auth0Client = await auth.createClient();

    isAuthenticated.set(await auth0Client.isAuthenticated());
    user.set(await auth0Client.getUser());
    if (isAuthenticated) {
      const accessToken = await auth0Client.getIdTokenClaims();
      if (accessToken) token.set(accessToken.__raw);
    }
  });

  function login() {
    auth.loginWithPopup(auth0Client);
  }

  function logout() {
    auth.logout(auth0Client);
  }


  const convert = (string) => {
    return isNaN(+string) ? 0 : +string;
  };

  const addCity = async () => {
    const naming = prompt("City: ") ?? "";
    const country = prompt("Country: ") ?? "";
    const people = convert(prompt("Population: ") ?? "");

    if (!naming || !country || !people) return;
    const response = await http.startExecuteMyMutation(
      OperationsDocHelper.MUTATION_insert(naming, country, people),
    );

    if (response !== null) {
      const returning = response.insert_laba3_cities.returning;
      cities.update((n) => [...n, returning[0]]); 
    }
  };

  const deleteCityOnCounrty = async () => {
    const country = prompt("Country: ") ?? "";
    const response = await http.startExecuteMyMutation(
      OperationsDocHelper.MUTATION_deleteOnCountry(country),
    );

    if (response !== null) {
      cities.update((n) => n.filter((item) => item.country_name !== country));
    }
  };

  const deleteCity = async () => {
    const city = prompt("City: ") ?? "";
    const response = await http.startExecuteMyMutation(
      OperationsDocHelper.MUTATION_deleteOnCity(city),
    );

    if (response !== null) {
      cities.update((n) => n.filter((item) => item.city_name !== city));
    }
  };
</script>

<main>
  {#if !$offline}
    {#if $isAuthenticated}
      <body>
        <div class="buttns">
          <button class="btn" on:click={logout}>Log out</button>
          <button class="btn" on:click={addCity}>Add</button>
          <button class="btn" on:click={deleteCity}>Delete city</button>
          <button class="btn" on:click={deleteCityOnCounrty}
            >Delete country</button
          >
        </div>
        <table border="1" class="ourTable">
          <caption>Cities</caption>
          <tr>
            <th>City</th>
            <th>Country</th>
            <th>Population</th>
          </tr>
          {#each $cities as city}
            <tr>
              <td>{city.city_name}</td>
              <td>{city.country_name}</td>
              <td>{city.population}</td>
            </tr>
          {/each}
        </table>
      </body>
    {:else}
      <button on:click={login}>Log in</button>
    {/if}
  {:else}
    <h1>You are offline</h1>
  {/if}

</main>

<style>
  .btn {
    background-color: #4caf50; /* Green */
    border: none;
    color: #fff;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-left: auto;
    margin-right: auto;
  }
  .buttns {
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
  }
  .btn:hover {
    opacity: 0.7;
  }
  .ourTable {
    margin-left: auto;
    margin-right: auto;
  }
</style>
