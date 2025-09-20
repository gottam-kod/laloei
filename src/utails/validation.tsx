  const emailValidator = (value: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!value) return "Email can't be empty.";
  if (!re.test(value)) return 'Oops! We need a valid email address.';
  return '';
}
const passwordValidator = (value: string) => {
  if (!value) return "Password can't be empty.";
  if (value.length < 5) return 'Password must be at least 5 characters long.';
  return '';
}

export { emailValidator, passwordValidator };