const createOnFocus =
  (name, focus) =>
    () => focus(name);
export default createOnFocus;
