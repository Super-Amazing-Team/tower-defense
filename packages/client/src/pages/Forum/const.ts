export interface IForumInfo {
  title: string;
  id: number;
}
export interface IDataNamesChats {
  data: IForumInfo[];
}

export interface IUser {
  userName: string;
  avatar: string;
}

export interface IForumMessage {
  text: string;
  user: IUser;
  date: string;
}

export interface IForum {
  title: string;
  description: string;
  id: number;
  messages: IForumMessage[];
}
// TODO Удалить после подключения к апи

export const forumMock: IForum = {
  title: "Название Форума",
  description:
    "Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, юмористические вставки или слова, которые даже отдалённо",
  id: 123,
  messages: [
    {
      date: "11-12-2020 13:00",
      user: {
        userName: "IlonMask",
        avatar: "",
      },
      text: "Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, юмористические вставки или слова, которые даже отдалённо не напоминают латынь. Если вам нужен Lorem Ipsum для серьёзного проекта, вы наверняка не хотите какой-нибудь",
    },
    {
      date: "11-12-2020 13:10",
      user: {
        userName: "SuperMan",
        avatar: "",
      },
      text: "Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, юмористические вставки или слова, которые даже отдалённо не напоминают латынь. Если вам нужен Lorem Ipsum для серьёзного проекта, вы наверняка не хотите какой-нибудь",
    },
    {
      date: "11-12-2020 13:40",
      user: {
        userName: "SuperMan",
        avatar: "",
      },
      text: "Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, юмористические вставки или слова, которые даже отдалённо не напоминают латынь. Если вам нужен Lorem Ipsum для серьёзного проекта, вы наверняка не хотите какой-нибудь",
    },
  ],
};
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
