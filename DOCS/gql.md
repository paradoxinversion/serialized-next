## Fetching

useSWR requires a fetcher that handles requests.

```javaScript
const fetcher = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((json) => json.data);
```

We then use the useSWR hook to get data.

```javaScript
 const { data: userSerials } = useSWR(
    `
    {
      ownSerials{
        _id
        slug
        title
        synopsis
        genre{
          name
        }
        author{
          username
        }
      }
    }
  `,
    fetcher
  );
```

We can send variables easily by string interpolation. We can (and should) also rename the incoming data. **Make sure to to double-quote string parameters here**

```javaScript
// Here, `author` is a User's `id` and `serialSlug` is a Serial's `slug` pulled from a dynamic route (/serials/[author]/[serialSlug])
const { data: serialData } = useSWR(`
  {
    serial(authorUsername: "${author}", serialSlug: "${serialSlug}"){
      _id
      slug
    }
  }
`,
  fetcher
);
```

As these are hooks, bear in mind `async/await` cannot be used, but they are non-blocking. We can use the lack of recieved data to conditionally render components until their data is received, or make useSWR calls dependent on completed data fetches by passing our `useSWR` parameters in an anonymous function.

```javaScript
const { data: someData } = useSWR(`
  {
    someQuery{
      someValue
    }
  }
`,
  fetcher
);

// This won't try to fetch until `someData` has returned data.
const { data: serialData } = useSWR(()=>`
  {
    someDependentQuery(someParamFromSomeQuery: "${someData.someQuery.someValue}"){
      someOtherValue
    }
  }
`,
  fetcher
);
```

### Refetching data

We can refetch data by using the `mutate` method deconstructed from useSWR.

```javaScript
  // getting our initial page data
  const { data: userSerials, mutate } = useSWR(...);

  // in some other code where refetching of that data is needed, such as a button onClick

  mutate("/api/graphql");
```

# Mutations

Here is an example from a form. `values` are from Formik's submit function in this instance. We use axios to send the string gql query and variables as one object with the `query` and `variables` properties.

```javaScript
const result = await axios.post("/api/graphql", {
  query: `mutation($username: String!, $password: String!, $birthdate: Date!, $email: String!){
    register(username: $username, password: $password, birthdate: $birthdate, email: $email){
      user {
        _id
        username
        role
        biography
        viewNSFW
      }
      error
    }
  }
  `,
  variables: {
    username: values.username,
    password: values.password,
    birthdate: new Date(values.birthdate),
    email: values.email,
  },
});
```
