import { Link } from "react-router-dom";

export function Forum() {
  return (
    <div>
      <h1>I&apos;m Forum Componen</h1>
      <div className="forum-links">
        <Link to={"/forum/1"}>Topic 1</Link>
        <Link to={"/forum/2"}>Topic 2</Link>
        <Link to={"/forum/3"}>Topic 3</Link>
      </div>
    </div>
  );
}
