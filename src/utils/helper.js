export function randomizePosition(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const formatVND = (value) => {
  const number = value.replace(/\D/g, "");
  if (number === "") return "";
  return parseInt(number).toLocaleString("vi-VN");
};
