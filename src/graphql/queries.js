/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWinners = /* GraphQL */ `
  query GetWinners($id: ID!) {
    getWinners(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listWinners = /* GraphQL */ `
  query ListWinners(
    $filter: ModelWinnersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWinners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
