export const phoneNoRegEx = new RegExp(
  /^\+?\d{1,4}[-.\s]?\(\d{1,4}\)[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$|\(\d{3}\)[-]?\d{3}[-]?\d{4}$/,
);

export const mobileNoRegEx = new RegExp(
  /^\+?\d{1,4}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
);
