export interface IForum {
  title: string;
  id: number;
}
export interface IDataNamesChats {
  data: IForum[];
}
// TODO Удалить после подключения к апи
export const namesChatsMock: IDataNamesChats = {
  data: [
    {
      title: "Первый",
      id: 123,
    },
    {
      title: "Two",
      id: 321,
    },
    {
      title: "Three",
      id: 132,
    },
    {
      title: "Four",
      id: 234,
    },
    {
      title: "Five",
      id: 432,
    },
    {
      title: "Six",
      id: 453,
    },
    {
      title: "Bla",
      id: 542,
    },
    {
      title: "BlaBla",
      id: 143,
    },
    {
      title: "BlaBlaBla",
      id: 876,
    },
    {
      title: "BlaBlaBlaBla",
      id: 999,
    },
    {
      title: "BlaBlaBlaBlaBla",
      id: 989,
    },
    {
      title: "Bla Bla",
      id: 626,
    },
    {
      title: "Bla Bla Bla",
      id: 499,
    },
    {
      title: "Bla Bla Bla Bla",
      id: 777,
    },
    {
      title: "Bla Bla Bla Bla Bla",
      id: 888,
    },
    {
      title: "Bla Bla Bla Bla Bla Bla",
      id: 555,
    },
    {
      title: "Bla Bla Bla Bla Bla Bla Bla",
      id: 666,
    },
  ],
};
