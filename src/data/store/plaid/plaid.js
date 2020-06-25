import plaid from "plaid"

export const client = new plaid.Client(
  process.env.REACT_APP_PLAID_CLIENT_ID,
  process.env.REACT_APP_PLAID_SECRET,
  process.env.REACT_APP_PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: "2018-05-22" }
);

