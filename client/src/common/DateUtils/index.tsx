export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const pad = (num: number) => {
  return num < 10 ? "0" + num : num;
};

export const toDateObj = (date: string) => {
  return new Date(date);
};

export const toDateStr = (date: string, format: (date: Date) => string) => {
  return format(new Date(date));
};

export const getMessageDateFormat = (date: Date) =>
  `${pad(date.getDate())}.${pad(
    date.getMonth()
  )}.${date.getFullYear()} ${date.getHours()}:${pad(date.getMinutes())}`;

export const getUnreadNotificationDateFormat = (date: Date) =>
  `${date.getHours()}:${date.getMinutes()} on ${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} `;

export const getDividerDateFormat = (date: Date) =>
  `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

export const equalUntilDay = (date1: Date | string, date2: Date | string) => {
  date1 = typeof date1 === "string" ? toDateObj(date1) : date1;
  date2 = typeof date2 === "string" ? toDateObj(date2) : date2;

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
