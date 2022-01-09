<script>
  import http from "./helper/request-helper";
  import { OperationsDocHelper } from "./helper/operations-doc-helper";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import auth from "./auth-service";
  import { isAuthenticated, user, cities, token } from "./store";

  const isLoading = writable(false);

  const newCountry = {};
  const deleteCountry = {};

  const offline = writable(false);

  window.onoffline = () => {
    offline.set(true);
  };
  window.ononline = () => {
    offline.set(false);
  };

  token.subscribe(async (value) => {
    if (value) {
      const result = await http.startFetchMyQuery(
        OperationsDocHelper.QUERY_get_all(),
      );

      cities.set(result.laba3_cities);
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
    const { city, country, population } = newCountry;
    if (!city || !country || !population) return;
    try {
      isLoading.set(true);
      const { insert_laba3_cities } = await http.startExecuteMyMutation(
        OperationsDocHelper.MUTATION_insert(city, country, population),
      );
      //console.log(newCity);
      cities.update((n) => [...n, insert_laba3_cities.returning[0]]);
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.set(false);
    }
    newCountry.city = "";
    newCountry.country = "";
    newCountry.population = "";
  };

  const deleteCityOnCounrty = async () => {
    const { country } = deleteCountry;
    try {
      isLoading.set(true);
      await http.startExecuteMyMutation(
        OperationsDocHelper.MUTATION_deleteOnCountry(country),
      );
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.set(false);
    }
  };

  const deleteCity = async (id) => {
    try {
      isLoading.set(true);

      await http.startExecuteMyMutation(
        OperationsDocHelper.MUTATION_deleteOnID(id),
      );
      cities.update((n) => n.filter((item) => item.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.set(false);
    }
  };
</script>

<main>
  {#if !$offline}
    {#if $isAuthenticated}
      <body>
        <!-- {#if isLoading} -->
        <!-- <img alt="loader" src="./loader.gif" /> -->
        <!-- {:else} -->
        <!--{JSON.stringify($cities)} -->
        <div class="buttns">
          <button class="btn" on:click={logout}>Log out</button>
        </div>

        <div>
          <div>
            <input placeholder="Enter city name" bind:value={newCountry.city} />
            <input
              placeholder="Enter country name"
              bind:value={newCountry.country}
            />
            <input
              placeholder="Enter population"
              bind:value={newCountry.population}
            />
            <button class="btn" on:click={addCity}>Add</button>
          </div>
        </div>

        <table border="1" class="ourTable">
          <caption>Cities</caption>
          <tr>
            <th>City</th>
            <th>Country</th>
            <th>Population</th>
            <th>Delete</th>
          </tr>
          <!-- {#each $cities as city} -->
          {#if $cities.length}
            {#each $cities as city (city.id)}
              <tr>
                <td>{city.city_name}</td>
                <td>{city.country_name}</td>
                <td>{city.population}</td>
                <td>
                  <button class="btn" on:click={() => deleteCity(city.id)}
                    >Delete city</button
                  >
                </td>
              </tr>
            {/each}
          {:else}
            <h1>No cities</h1>
          {/if}
        </table>
        <!-- {/if} -->
      </body>
    {:else}
      <button class="btn" on:click={login}>Log in</button>
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
