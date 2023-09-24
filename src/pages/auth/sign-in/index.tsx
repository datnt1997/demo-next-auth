import * as React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn = () => {
  const { data: session } = useSession();
  const router = useRouter()
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitForm = async () => {
    const result = await signIn("credentials", { username, password },  { callbackUrl: "/" });
    console.log('result', result)
  };

  React.useEffect(()=>{
    if (session){
      router.push('/')
    }
  },[session])

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            name="password"
            required
          />
        </div>
        <div className="form-group">
          <button type="button" onClick={onSubmitForm}>Sign In</button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
