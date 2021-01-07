# Serialized - Next

This is the final form of the long-time Serialized fiction platform project.

## Installation

```bash
git clone https://github.com/paradoxinversion/serialized-next.git
cd serialized-next
touch .env
yarn install
```

Inside of the `.env` file

```
DATABASE_URI=mongodb://localhost/<your-db-name>
SALT=<salt-integer>
ADMIN_USERNAME=<default-username>
ADMIN_PASSWORD=<default-password>
SECRET=<secret-key>
```

## Usage

### Development

```
yarn run dev
```

or

```
yarn dev
```

## Built with

- Nextjs
- MongoDB
- GraphQL
- TailwindCSS
