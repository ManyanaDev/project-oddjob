import { Button } from "oddjob-ui/components/button";
import type { User } from "oddjob-types/payload";

async function getUsers() {
  try {
    const users = await fetch("http://localhost:3001/api/users");
    const data = await users.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const users = await getUsers();
  console.log(users);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
