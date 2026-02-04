interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface CreateUserDto extends User {
  password: string;
}
