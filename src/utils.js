export const getLocalStorage = (items) => {
  return JSON.parse(localStorage.getItem(items));
};

export const setLocalStorage = (items) => {
  localStorage.setItem("notesData", JSON.stringify(items));
};

export const getCallback = (callbackName) => {
  if (callbackName && typeof window[callbackName] === "function")
    return window[callbackName];
  else console.error(`No callback defined for ${callbackName}`);
};

export const randomId = () => {
  const randomString = Math.random().toString(16).slice(2);
  const paddingLength = 20 - randomString.length;
  const padding = "0".repeat(paddingLength);
  return padding + randomString;
};
