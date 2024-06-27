import { FC } from "react";

interface pageProps {}

const TeacherDashboard: FC<pageProps> = async ({}) => {
  const res = await fetch(`${process.env.APP_URL}/api/items`);

  let items;
  if (res.ok) {
    const itemsJson = await res.json();
    items = itemsJson;
  }

  console.log(items);
  return (
    <div>
      Teacher Dashboard{" "}
      {items?.map((item: any) => (
        <p>{item.title}</p>
      ))}
    </div>
  );
};

export default TeacherDashboard;
