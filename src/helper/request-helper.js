import { get } from "svelte/store";
import { token } from "../store";
import { isDebugMode } from "../cosntants";

class RequestHelper {
  constructor() {
    this.API_url = process.env.HASURA_API_PROJECT_URL;
  }
  async fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(this.API_url, {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
      headers: {
        Authorization: `Bearer ${get(token)}`,
      },
    });

    return await result.json();
  }

  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async startFetchMyQuery(operationsDoc) {
    const { errors, data } = await this.fetchMyQuery(operationsDoc);

    if (errors) {
      if (isDebugMode) {
        throw new Error(`Query was not successful: ${errors}`);
      } else {
        console.error(`Query was not successful: ${errors}`);
        return null;
      }
    }

    if (isDebugMode) {
      console.log(data);
    }

    return data;
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }

  async startExecuteMyMutation(operationsDoc) {
    const { errors, data } = await this.executeMyMutation(operationsDoc);

    if (errors) {
      if (isDebugMode) {
        throw new Error(`Query was not successful: ${errors}`);
      } else {
        console.error(`Query was not successful: ${errors}`);
        return null;
      }
    }

    if (isDebugMode) {
      console.log(data);
    }
    
    return data;
  }
}

export default new RequestHelper();
