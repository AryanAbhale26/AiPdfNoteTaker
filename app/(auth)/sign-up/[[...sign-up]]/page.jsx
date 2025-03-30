import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className=""
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <SignUp />
    </div>
  );
}
