interface User {
  name: string;
  id: string & { readonly _: unique symbol };
  someOtherId: string;
}

function getUsers(): User[] {
  return [];
}

function getUserDetails(id: User["id"]) {
  return fetch(`/api/users/${id}`);
}

const users = getUsers();
const user = users[0];

// OK
getUserDetails(user.id);

// @ts-expect-error -- Not all strings are accepted
getUserDetails(user.someOtherId);
