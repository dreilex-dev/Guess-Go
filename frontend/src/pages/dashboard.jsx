import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return <div>You need to sign in first!</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.firstName}</h2>
    </div>
  );
};

export default Dashboard;
