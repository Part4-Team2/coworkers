import clsx from "clsx";

function SideHeader() {
  return (
    <div className={clsx("flex justify-between", "bg-background-secondary")}>
      This is Side Header
    </div>
  );
}

export default SideHeader;
